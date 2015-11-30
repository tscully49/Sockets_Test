module.exports = function (io) {
	var people = {};
	var messages = [];

	io.on('connection', function (client) {
	  	
	  	console.log('a user connecteddd');
	  	
	  	client.on('join', function(profile) {
	  		if (messages.length === 500) {
        		messages.shift();
        		io.emit("remove-first");
        	}
	  		var cachedMessages = {"name": profile.name, "image": profile.image, "message": " has joined the server.", "type": "connection"};
        	console.log(cachedMessages.name + cachedMessages.message);
        	messages.push(cachedMessages);

	  		people[client.id] = {"name": profile.name, "image": profile.image};
	  		client.broadcast.emit('update', profile.name + " has joined the server.");
	  		io.emit('update-people', people);
	  		client.emit('load-messages', messages);
	  	});
	  	
	  	client.on("send", function(msg){
	  		if (msg === "read") {
	        	io.emit("chat", people[client.id], messages.length);
    		} else {
    			if (messages.length === 500) {
	        		messages.shift();
	        		io.emit("remove-first");
	        	}
		  		var cachedMessages = {"name": people[client.id].name, "image": people[client.id].image, "message": msg, "type": "message"};
	        	io.emit("chat", people[client.id], msg, people);
	        	console.log(people[client.id].name+":  "+msg);
	        	messages.push(cachedMessages);
	        	console.log(people);
	        	console.log(io.engine.clientsCount);
	        }
    	});

    	client.on('leave', function() {
    		// Add logic for leaving a channel without disconnecting without two messages being added if someone leaves and then disconnects
    	});
	  	
	  	client.on('disconnect', function(){
		    //console.log('user disconnected');
		    if (typeof people[client.id] != 'undefined') {
		    	if (messages.length === 500) {
	        		messages.shift();
	        		io.emit("remove-first");
	        	}
	        	
		    	io.emit('update', people[client.id]["name"] + " has left the server.");
		    	var cachedMessages = {"name": people[client.id].name, "image": people[client.id].image, "message": " has left the server.", "type": "connection"};
        		console.log(cachedMessages.name + cachedMessages.message);
        		messages.push(cachedMessages);
		    }
		    delete people[client.id];
		    io.emit('update-people', people);
		});
	
	});

};
