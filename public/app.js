var videoArea = document.querySelector("video");
var videoSelect = document.querySelector("#camera");

var myName = document.querySelector("#myName");
var myMessage = document.querySelector("#myMessage");
var sendMessage = document.querySelector("#sendMessage");
var chatArea = document.querySelector("#chatArea");
var ROOM = "chat";

/*if(typeof MediaStreamTrack == 'undefined' || typeof 
MediaStreamTrack.getSources == 'undefined') {
    document.querySelector("cameraSelector").style.visibility="hidden";
}else {
    MediaStreamTrack.getSources(getCameras);
}

videoSelect.onchange = startStram;
startStram();
*/

io = io.connect();
io.emit('ready', ROOM);
io.on('announce', function(data){
    displayMessage(data.message);
})

io.on('message', function(data){
    displayMessage(data.author + ": " + data.message);
})


sendMessage.addEventListener('click', function(ev){
    io.emit('send', {
        author: myName.value,
        message: myMessage.value,
        root: ROOM
    })
    ev.preventDefault();

}, false );



function displayMessage(message){
    chatArea.innerHTML = chatArea.innerHTML + "<br/>>" + message;
}


navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

var constraint = { audio: false,  video: true};
var videoArea =  document.querySelector("video");
navigator.getUserMedia(constraint, onSuccess, onError);
function onSuccess(stream) {
    console.log("Success ! We have a stream");
    videoArea.src = window.URL.createObjectURL(stream);
    videoArea.play();
}

function onError(error) {
    console.log("Error with getUserMedia", error);
}