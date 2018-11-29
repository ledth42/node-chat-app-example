const socket = io();
socket.on('connect', function() {
  console.log('Connected to server: ');
  socket.emit('join', $.deparam(window.location.search), function(err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  })
});

// listen new message
socket.on('newMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const messageTemplate = $('#message-template').html();
  const html = Mustache.render(messageTemplate, {
    text: message.message,
    from: message.from,
    createdAt: formattedTime
  })
  $('#messages').append(html);
  scrollToBottom();
});

// listen new location message
socket.on('newLocationMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const locationTemplate = $('#location-template').html();
  const html = Mustache.render(locationTemplate, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToBottom();
});

// update user list
socket.on('updateUserList', function(userList) {
  console.log('updateUserList', userList);
  const ol = $('<ol></ol>');
  userList.forEach(function(user){
    const li = $('<li></li>').text(user.name);
    ol.append(li);
  });
  $('#users').html(ol);
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});


$('#message-form').on('submit', function(e){
  e.preventDefault();
  const messageTextbox = $('[name=message]');
  socket.emit('createMessage', {
    message: messageTextbox.val()
  }, () => {
    messageTextbox.val('');
  })
});

const locationButton = $('#send-location');

locationButton.on('click', function (e) {
  if(!navigator.geolocation) {
    return alert('Geolocation are not supported by your browser');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {latitude: position.coords.latitude, longitude: position.coords.longitude})
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });
});

function scrollToBottom() {
  const messages = $('#messages');
  const newMessage = messages.children('li:last-child');

  // calculate height
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}
