const electron = require('electron');
const {app,BrowserWindow} = require('electron'); // Importing BrowserWindow and app module from electron
// BrowserWindow is responsible for UI related parts and app is responsible for events
const path = require('path');
const url = require('url');

// IPC is required for secure communication between renderer and main process
const ipc = electron.ipcMain;
const dialog = electron.dialog;

console.log('This is From the main process');

let win;
function createWindow(){
    win = new BrowserWindow({ // Webpreference is given so that from the html we can use nodeJs stuffs like require
        title:'Main window',
        webPreferences: {
            nodeIntegration: true, // Although not preferred for security reasons
            enableRemoteModule: true, // This is done so that the rendered process can also use remote module
        }
    });

    // Loading the URL of the HTML file that the User Sees
    win.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file',
        slashe:true
    }))

    // For Devtools inside Windoe
    win.webContents.openDevTools();
    // So that we can close the window
    win.on('closed',()=>{
        win = null;
    })
}

// IPC listening on a particular event from a rendered process
ipc.on('error-dialog-box',(e)=>{
    dialog.showErrorBox('Error Message','Demo')
    
    // Ipc sending message to a renderd process to this particular event
    // The first argument of send() is the event for which msg to be sent
    // The second arg of the send() is the message to be sent 
    e.sender.send('opened the box','this message is from the Main.js process') 
})


app.on('ready',createWindow); // When the Application is ready we call the createWindow function
