// As Import Statements do not work in frontEnd so we have to use Webpack
// import * as Y from 'yjs'
// import { WebsocketProvider } from 'y-websocket'
// import { QuillBinding } from 'y-quill'
// import Quill from 'quill'
const Y = require('yjs');
const y_websocket = require('y-websocket');
const { WebsocketProvider } = y_websocket
const yquill = require('y-quill');
const {QuillBinding} = yquill;
const QuillCursors = require('quill-cursors');
const Quill = require('quill');
const { io } = require('socket.io-client');

const electron = require('electron');
const ipc = electron.ipcRenderer;
ipc.on('create-Room',(e,msg)=>{
  console.log(msg);
})

window.addEventListener('load', () => {
  Quill.register('modules/cursors', QuillCursors)
  const ydoc = new Y.Doc()
  // Socket
  let new_room;
  let username;
  let total_rooms=[];
  const socket = io.connect('https://ancient-refuge-95229.herokuapp.com');
  socket.on('room',data=>{
    username = data.username;
    new_room = data.roomID;
    total_rooms.push(data.roomID);
    console.log(total_rooms);
    console.log(`New Room from client :${new_room}`);
  const provider = new WebsocketProvider('wss://shielded-sierra-61478.herokuapp.com',`${new_room}`, ydoc)
  const type = ydoc.getText(`${new_room}`);
  // To delete text --> ydoc.destroy
  // Unique client Id --> ydoc.clientID
  // console.log(ydoc);
  const editorContainer = document.createElement('div')
  editorContainer.setAttribute('id', 'editor')
  document.body.insertBefore(editorContainer, null)

  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'image','code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']  
  ];
  var editor = new Quill(editorContainer, {
    modules: {
      cursors : true,
      toolbar:toolbarOptions,
      // readOnly:true,
      history: {
        userOnly: true
      }
      //scrollingContainer:false
    },
    placeholder: 'Start collaborating...',
    theme: 'snow' // or 'bubble'
  })   

  const binding = new QuillBinding(type, editor, provider.awareness)

  if(!username)username='Anonymous';
  provider.awareness.setLocalStateField('user', {
    name: `${username}`,
    color: 'blue'
  });

  const connectBtn = document.getElementById('y-connect-btn')
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  // // @ts-ignore
  // window.example = { provider, ydoc, type, binding, Y }
})
// Socket connectione ends here
});
