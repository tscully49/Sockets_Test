var socket;

$(document).ready(function() {
  //var socket = io();
  var calculatedHeight = parseInt($('body').height()) - parseInt($('#2').outerHeight());

  $('.form-inline').css('width', $(document).find('.container').css('width'));
  $('#msgs, #people').css('height', calculatedHeight - $('#div-title').outerHeight(true) - 3);

  $("form").submit(function(event){
    event.preventDefault();
  });

  $('#messages-wrapper').hide();
  $('#chat').hide();

  $("#send").click(function(){
    //var socket = io();
    var msg = $("#msg").val();
    if (msg.trim()) {
      socket.emit("send", msg);
      $("#msg").val("");
    }
  });

  $("#msg").keypress(function(e){
    //var socket = io();
    console.log("SENT")
    if(e.which == 13) {
      var msg = $("#msg").val();
      if (msg.trim()) {
        socket.emit("send", msg);
        $("#msg").val("");
      }
    }
  });
});

  /*socket.on("update", function(msg) {
    if(ready) {
      $("#msgs").append($('<li>').text(msg).addClass("updated-person"));
      $("#msgs").scrollTop($('#msgs')[0].scrollHeight);
    }
  });

  socket.on("update-people", function(people){
    if(ready) {
      $("#people").empty();
      $.each(people, function(clientid, person) {
        if (person.image === undefined) {
          //$('#people').append("<div class='no-profile-image'></div>").append($('<li>').text(person.name));
          $('#people').append($('<li class=person-object>').append($('<div>').addClass("no-profile-image all-people")).append($('<h5 class="people-in-room">').text(person.name)));
        } else {
          //$('#people').append("<img class='profile-picture' src='"+person.image+"'>").append($('<li>').text(" "+person.name).addClass("people-in-room"));
          $('#people').append($('<li class=person-object>').append($("<img class='profile-picture all-people' src='"+person.image+"'>").addClass("no-profile-image")).append($('<h5 class="people-in-room">').text(person.name)));
        }
      });
    }
  });

  socket.on("chat", function(person, msg){
    if(ready) {
      if (person.image === undefined) {
        $("#msgs").append($('<li class="message-list">').html("<div class='no-profile-image'></div>" + " <div class='message-text'>" + msg + "</div>"));
      } else {
        //$("#msgs").append($('<li class="message-list">').html("<b>"+person.name + ":</b>  " + msg));
        $("#msgs").append($('<li class="message-list">').html("<img src='"+person.image+"' class='profile-picture' alt='"+person.name+"'> " + " <div class='message-text'>" + msg + "</div>"));
      }          
      $("#msgs").scrollTop($('#msgs')[0].scrollHeight);
    }
  });

  socket.on("disconnect", function(){
    $("#msgs").append("The server is not available");
    $("#msg").attr("disabled", "disabled");
    $("#send").attr("disabled", "disabled");
  });

  socket.on("remove-first", function() {
    $('#msgs').find('li').first().remove();
  });

  socket.on('load-messages', function(messages){
    //for(var i = 0; i < messages.length; i++) {
    jQuery.each(messages, function(i, message) {
      if (message.type === "message") {
        if (message.image === undefined) {
          $("#msgs").append($('<li class="message-list">').html("<div class='no-profile-image'></div>" + " <div class='message-text'>" + message.message + "</div>"));
        } else {
          //$("#msgs").append($('<li class="message-list">').html("<b>"+person.name + ":</b>  " + msg));
          $("#msgs").append($('<li class="message-list">').html("<img src='"+message.image+"' class='profile-picture' alt='"+message.name+"'> " + " <div class='message-text'>" + message.message + "</div>"));
        }
      } else {
        $("#msgs").append($('<li class="updated-person">').html(message.name + message.message));
      }
    });
    $("#msgs").scrollTop($('#msgs')[0].scrollHeight);
  });
});*/

function onSignIn(googleUser) {
  socket = io();
  var profile = googleUser.getBasicProfile();
  var user_profile = { "name": profile.getName(), "image": profile.getImageUrl(), "email": profile.getEmail() }
  /*console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());*/
  socket.connect();

  $("#msg").attr("disabled", null);
  $("#send").attr("disabled", null);

  if (profile.getName() != "") {
    socket.emit("join", user_profile);
    //$("#login").detach();
    $("#login-wrapper").hide();
    $("#messages-wrapper").show();
    $("#chat").show();
    $("#msg").focus();
    ready = true;
  }

  socket.on("update", function(msg) {
    if(ready) {
      $("#msgs").append($('<li>').text(msg).addClass("updated-person"));
      $("#msgs").scrollTop($('#msgs')[0].scrollHeight);
    }
  });

  socket.on("update-people", function(people){
    if(ready) {
      $("#people").empty();
      $.each(people, function(clientid, person) {
        if (person.image === undefined) {
          //$('#people').append("<div class='no-profile-image'></div>").append($('<li>').text(person.name));
          $('#people').append($('<li class=person-object>').append($('<div>').addClass("no-profile-image all-people")).append($('<h5 class="people-in-room">').text(person.name)));
        } else {
          //$('#people').append("<img class='profile-picture' src='"+person.image+"'>").append($('<li>').text(" "+person.name).addClass("people-in-room"));
          $('#people').append($('<li class=person-object>').append($("<img class='profile-picture all-people' src='"+person.image+"'>").addClass("no-profile-image")).append($('<h5 class="people-in-room">').text(person.name)));
        }
      });
    }
  });

  socket.on("chat", function(person, msg, id){
    if(ready) {
      if (person.image === undefined) {
        $("#msgs").append($('<li class="message-list">').html("<div class='no-profile-image'></div>" + " <div class='message-text'>" + msg + "</div>"));
      } else {
        //$("#msgs").append($('<li class="message-list">').html("<b>"+person.name + ":</b>  " + msg));
        $("#msgs").append($('<li class="message-list">').html("<img src='"+person.image+"' class='profile-picture' alt='"+person.name+"'> " + " <div class='message-text'>" + msg + "</div>"));
      }          
      $("#msgs").scrollTop($('#msgs')[0].scrollHeight);
      console.log('caught chat emit');
      console.log(id);
    }
  });

  socket.on("disconnect", function(){
    $("#msgs").append("The server is not available");
    $("#msg").attr("disabled", "disabled");
    $("#send").attr("disabled", "disabled");
  });

  socket.on("remove-first", function() {
    $('#msgs').find('li').first().remove();
  });

  socket.on('load-messages', function(messages){
    //for(var i = 0; i < messages.length; i++) {
    jQuery.each(messages, function(i, message) {
      if (message.type === "message") {
        if (message.image === undefined) {
          $("#msgs").append($('<li class="message-list">').html("<div class='no-profile-image'></div>" + " <div class='message-text'>" + message.message + "</div>"));
        } else {
          //$("#msgs").append($('<li class="message-list">').html("<b>"+person.name + ":</b>  " + msg));
          $("#msgs").append($('<li class="message-list">').html("<img src='"+message.image+"' class='profile-picture' alt='"+message.name+"'> " + " <div class='message-text'>" + message.message + "</div>"));
        }
      } else {
        $("#msgs").append($('<li class="updated-person">').html(message.name + message.message));
      }
    });
    $("#msgs").scrollTop($('#msgs')[0].scrollHeight);
  });
}

$(document).on("click", "#signout-button", function(event) {
  var auth2 = gapi.auth2.getAuthInstance();
  //var socket = io();

  event.preventDefault();
  auth2.signOut().then(function () {
    $("#login-wrapper").show();
    $("#messages-wrapper").hide();
    $("#chat").hide();
    ready = false;
    socket.disconnect();
    socket = null;
  });
});
