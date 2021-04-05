const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path')
const url = require('url')
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('COM3', { baudRate: 115200 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));// Read the port data

port.on("open", () => {
  console.log('serial port open');
});

parser.on('data', data => {
  console.log('got word from arduino:', data);
  mainWindow.webContents.send('com-read', data);
});

ipcMain.on('com-write', (event, args) => {
    port.write(args + '\n');
    console.log('written: ' + args);
})

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })
}

app.allowRendererProcessReuse=false

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    app.quit()
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})