console.log('This is from the rendered window');
const electron = require('electron')
const {BrowserWindow} = require('electron').remote; 
const path = require('path')
const url = require('url');



// Shell is used to access/open files and folders
const btn = document.getElementById('btn')
const shell = require('electron').shell;

btn.addEventListener('click',()=>{
    // shell.showItemInFolder('url of file')
    // shell.openExternal('url of link')
})


// IPC is required for secure communication between renderer and main process
const ipc = electron.ipcRenderer;

let win2;

// This function will make a new Rendred window from a rendered process
// So we can make a renderd window from another rendered process
// and rendered windows do not interfere in each other work

function createWindow(){
    win2 = new BrowserWindow()
    win2.loadURL(url.format({
        pathname:path.join(__dirname,'rendered.html'),
        protocol:'file',
        slashe:true
    }))
    win2.webContents.openDevTools();
    win2.on('closed',()=>{
        win = null;
    })
}

document.querySelector('#newWindow').addEventListener('click',createWindow);

// IPC code .............................................................


// The first argument of send() is the event for which msg to be sent
// The second arg of the send() is the message to be sent 

document.getElementById('errorbtn').addEventListener('click',()=>{
    // Sending ipc message on a event to a main process
    ipc.send('error-dialog-box')
})

// Listening for messages from the main Process
ipc.on('opened the box',(e,arg)=>{ // the event of which this message is coming and what is in the message is in arg
    console.log(arg);
})

// We also have a Synchronous IPC  .sendSync() this blocks the code running below it 
// See docs for more