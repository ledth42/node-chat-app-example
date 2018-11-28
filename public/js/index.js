const socket = io();
socket.on('connect', function() {
  console.log('Connected to server: ');
});

// listen new message
socket.on('newMessage', function(message) {
  const li = $('<li></li>');
  li.text(`${message.from}: ${message.message}`);
  $('#messages').append(li);
});

// listen new location message
socket.on('newLocationMessage', function(message) {
  const li = $('<li></li>');
  const a = $('<a target="_blank">My location</a>');
  a.attr('href', message.url);
  li.text(`${message.from}: `);
  li.append(a);
  $('#messages').append(li);
});


socket.on('disconnect', function() {
  console.log('Disconnected from server');
});


$('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    message: $('[name=message]').val()
  })
});

const locationButton = $('#send-location');

locationButton.on('click', function (e) {
  if(!navigator.geolocation) {
    return alert('Geolocation are not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {latitude: position.coords.latitude, longitude: position.coords.longitude})
  }, function () {
    alert('Unable to fetch location');
  });
});
