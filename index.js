// We can use nodeJs like functionlaity in Browser too becoz of electron 
const electron = require('electron')
const {uuid} = require('uuidv4')
const createroom = document.getElementById('createroom');
let username = document.getElementById('userCreate');

// IPC is required for secure communication between renderer and main process
const ipc = electron.ipcRenderer;

createroom.addEventListener('click',async (e)=>{
    username = username.value;
    e.preventDefault(); 
    console.log(uuid());
    ipc.send('Create-Room',{id:uuid(),username:username})
    
    // const res = await axios.get('https://ancient-refuge-95229.herokuapp.com/room');
    // console.log(res);
})