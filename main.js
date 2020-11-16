const electron = require('electron');
const {app,BrowserWindow} = electron; // Importing BrowserWindow and app module from electron
// BrowserWindow is responsible for UI related parts and app is responsible for events
const path = require('path');
const url = require('url');

process.env.NODE_ENV = 'production';

// // IPC is required for secure communication between renderer and main process
// const ipc = electron.ipcMain;
// const dialog = electron.dialog;

console.log('This is From the main process');

let win;
const createWindow = async() => {
    win = new BrowserWindow({ // Webpreference is given so that from the html we can use nodeJs stuffs like require
        title:'Screen Recorder',
        minHeight:600,
        minWidth:800,
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
    if(process.env.NODE_ENV !== 'production')
      win.webContents.openDevTools();

    // So that we can close the window
    win.on('closed',()=>{
        win = null;
    })
}

app.on('ready',createWindow); // When the Application is ready we call the createWindow function

// For Mac-Os additional commands
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });
 