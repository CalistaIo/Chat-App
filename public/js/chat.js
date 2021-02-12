const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

// const button = document.getElementById('increment');

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count);
// });

// button.onclick = () => {
//     socket.emit('increment');
// }

// need to access template and location where template is inserted
socket.on('message', (mesg) => {
    const html = Mustache.render(messageTemplate, {message: mesg});
    $messages.insertAdjacentHTML('beforeend', html);
});

// display url as link
socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationTemplate, {location});
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // disable form
    $messageFormButton.setAttribute('disabled', 'disabled');
    const mesg = e.target.elements.message.value;
    socket.emit('sendMessage', mesg, (error) => {
        // enable form
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
    // e.target.elements.message.value = '';
    // e.target.elements.message.focus();
});

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported in your browser.');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude}, () => {
                $sendLocationButton.removeAttribute('disabled');
                console.log('Location shared!');
            });
    });
});