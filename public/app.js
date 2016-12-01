var videoArea = document.querySelector("video");
var videoSelect = document.querySelector("#camera");

var myName = document.querySelector("#myName");
var myMessage = document.querySelector("#myMessage");
var sendMessage = document.querySelector("#sendMessage");
var chatArea = document.querySelector("#chatArea");
var ROOM = "chat";
var SIGNAL_ROOM = "signal_room";
var signalingArea = document.querySelector("#signalingArea")
var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;


// peer2peer channel
var configuration = {
iceServers: [
     {url: "stun:stun.1.google.com:19302"}
    ]   
};


var rtcPeerConn
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
io.emit('ready', {
        chat_room: ROOM,
        signal_room: SIGNAL_ROOM    
});

io.on('announce', function(data){
    displayMessage(data.message);
})

io.emit('signal', {
    type: "user_here",
    message: "are you ready for call",
    room: SIGNAL_ROOM
})

io.on('signaling_message', function(data){
    displaySignalingMessage("Signal Received:" + data.type)


// startSignaling function startStram

function startSignaling(){
    displaySignalingMessage("start signaling....");
    rtcPeerConn = new PeerConnection(configuration)
    // send any ice candidate to the other peer2peer
    rtcPeerConn.onicecandidate = function(evt){
        if(evt.candidate)
        io.emit('signal', {
            type: "ice_candidate",
            message: JSON.stringify({'candidate': evt.candidate}),
            room: SIGNAL_ROOM});
            displaySignalingMessage("complated that ice candidate....")};

            // let the "negotiationneeded" event trigger offer genration
                rtcPeerConn.onnegotiationneeded = function(){
                displaySignalingMessage("on negotiation called");
                rtcPeerConn.createOffer(sendLocalDesc, logError);
            }

            // once remote stream arrives, show it in the remote video element
            rtcPeerConn.onaddstream = function(evt){
                displaySignalingMessage("going to add thir stream...");
                theirVideoArea.src = URL.createObjectURL(evt.stream);
            };

            // get alocal stram show it in our video tag
            navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
            navigator.getUserMedia({
                'audio': true,
                'video': true},
                function(stream){
                    displaySignalingMessage("going to display my stram...");
                    myVideoArea.src = URL.createObjectURL(stream);
                    rtcPeerConn.addStream(stream);
                }, logError)


    }
console.log(startSignaling())
// startSignaling function end 
    // setup RTC Peer Connection object
    if(!rtcPeerConn)
    startSignaling();
    if(data.type != "user_here"){
        var message = JSON.parse(data.message);
        if (message.sdp) {
            rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), function(){
                // if we got offer 
                if(rtcPeerConn.RemoteDescription.type == 'offer'){
                    rtcPeerConn.createAnswer(sendLocalDesc, logError);
                }
            }, logError)
        }
        else{
            rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));

        }
    }
    
});


function sendLocalDesc(desc) {
    rtcPeerConn.setLocalDescription(desc, function(){
        displaySignalingMessage("sending local description");
        io.emit('signal', {
            type:"SDP",
            message: JSON.stringify({'sdp': rtcPeerConn.setLocalDescription}),
            room: SIGNAL_ROOM});
    },logError);
}


function logError(error){
    displaySignalingMessage(error.name + ': ' + error.message);
}

/////////

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

function displaySignalingMessage(message){
    signalingArea.innerHTML = signalingArea.innerHTML + "<br/>>" + message;
}




function onError(error) {
    console.log("Error with getUserMedia", error);
}

