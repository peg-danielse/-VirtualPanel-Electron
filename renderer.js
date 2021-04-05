// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron')
const serialport = require('serialport')

function sendToArduino() {
  let send = document.getElementById('arduinoText').value;
  
  ipcRenderer.send('com-write', send.toString());

}

ipcRenderer.on('com-read', (event, args) => {
  document.getElementById("incomingData").value += args;
});
