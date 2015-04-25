var server_name="http://localhost:3000/";
var socket=io.connect(server_name);

var $messageBox = $('#userMessageArea');
var name="anon";
var color=getRandomColor();
var modalOpen=true;

$(document).ready(function(){
		$("#myModal").modal('show');
});

$("#usernameButton").on('click',function(){
	name=$('#usernameInput').val();
	modalOpen=false;
})

function addEntry(message){

	$('#ChatList').append(
    	$('<li>').append(
    		message.username+': '+message.text
    	)
    	.css('color',message.color)
    );
     $("#chatScroll").animate({ scrollTop: $("#chatScroll")[0].scrollHeight}, 3000);
}

function addSelfEntry(){

	$('#ChatList')
	.append(
    	$('<li>')
    	.append(
    		"You: "+$messageBox.val()
    	)
    	.css('color',color)
    );
    $("#chatScroll").animate({ scrollTop: $("#chatScroll")[0].scrollHeight}, 3000);
}

socket.on('insertMessage',function(message){
	addEntry(message);
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


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