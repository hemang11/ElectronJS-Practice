const electron= require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const Menu = electron.Menu
const contextMenu = electron.MenuItem;
const globalShortcut = electron.globalShortcut;

let win;
function createWindow(){
    win = new BrowserWindow({ // Webpreference is given so that from the html we can use nodeJs stuffs like require
        title:'Menu window',
        webPreferences: {
            nodeIntegration: true, // Although not preferred for security reasons
            enableRemoteModule: true, // This is done so that the rendered process can also use remote module
        }
    });
    win.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file',
        slashe:true
    }))

    win.on('closed',()=>{
        win = null;
    })
}

// All our code for menu is here
app.on('ready',()=>{
    createWindow();
    
    const template = [
        {
            label:'demo',
            submenu:[
                {
                    label:'submenu 1',
                    click:()=>{
                        console.log('Submenu1')
                    }
                },
                {
                    label:'submenu 2',
                    submenu:[
                        {
                            label:'Sub Sub Menu',
                            click:()=>{
                                console.log('Sub Sub menu')
                            }
                        }
                    ]
                }
            ]
        },
        {
            label:'Help',
            submenu:[
                {
                    label:'Open Github',
                    click:()=>{
                        electron.shell.openExternal('https://github.com/hemang11');
                    },
                    // Accelerators used for Keyboard Shortcuts
                    accelerator:'CmdOrCtrl + Shift + H' 
                }
            ]
        }
    ]


    // Built in Menu from electron with roles
    const template2 = [
        {
            label:'Edit',
            submenu:[
                {role:'undo'},
                {role:'redo'},
                {role:'separator'},
                {role:'selectall'}
            ]
        }
    ]



    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)

    // Context Menu (Right Click)
    const ctxMenu = new Menu();
    ctxMenu.append(new contextMenu(
        {
            label:'Ctx Menu 1',
            click:()=>{
                console.log('Context Menu 1')
            }
        }
    ))
    ctxMenu.append(new contextMenu({role:'selectAll'}));

    // Global Shortcut is a Shorcut which is used even when your app is not focued
    // Register Global Shortcut
    globalShortcut.register('Alt+1',()=>{
        win.show();
    })

    // Attaching context Menu to the Window
    // win webcontents listening on context Menu event
    win.webContents.on('context-menu',function(event,params){
        ctxMenu.popup(win,params.x,params.y);
    })

});

// When your app is quit All Global Shortcuts are Unregistered
app.on('will-quit',()=>{
    globalShortcut.unregisterAll();
})