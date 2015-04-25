//auto-discovery
var socket=io();

//variable for the input message box
var $messageBox = $('#userMessageArea');
//default username
var name="Anon";
//get a random color for this user
var color=getRandomColor();
//to decide whether or not to act on ENTER key press
var modalOpen=true;

//show the bootstrap modal
$(document).ready(function(){
		$("#myModal").modal('show');
});

//on clicking the save username button, store the value in the name variable
$("#usernameButton").on('click',function(){
	name=$('#usernameInput').val();
	modalOpen=false;
})

//sends a message object to the server with username, message and color so the server doesn't need to keep track of user properties
function addEntry(message){

	$('#ChatList').append(
    	$('<li>').append(
    		message.username+': '+message.text
    	)
    	.css('color',message.color)
    );
    //auto scroll to bottom of chat window
     $("#chatScroll").animate({ scrollTop: $("#chatScroll")[0].scrollHeight}, 3000);
}

//adds an entry to own chatbox with own outgoing message
function addSelfEntry(){

	$('#ChatList')
	.append(
    	$('<li>')
    	.append(
    		"You: "+$messageBox.val()
    	)
    	.css('color',color)
    );
    //auto scroll to bottom of chat window
    $("#chatScroll").animate({ scrollTop: $("#chatScroll")[0].scrollHeight}, 3000);
}

//when a new message comes in from the server, call the addEntry method
socket.on('insertMessage',function(message){
	addEntry(message);
});

//generate a random color. Code from this SO answer: http://stackoverflow.com/a/1484514/2021149
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//emits an outgoing message with text, username and color
//also resets value in the message box
function sendMessage(){
	var text=$messageBox.val();
	$messageBox.val("")
	var username=name;
	var messageObject={
		text:text,
		username:username,
		color:color
	};
	socket.emit('newMessage',messageObject);
}

//handles the ENTER keydown event
//want to call sendMessage() when Enter is pressed unless modal has not been closed
// if modal has not been closed is equivalent to clicking the save button
 $(document).keydown(function (event) {

 	//When the user presses the enter key
 	 if (event.which === 13) {
 	   if(!modalOpen){
	 	   addSelfEntry();
	       sendMessage();
	   }
	   else{
     	$('#usernameButton').click();
     	}
     }

    
});