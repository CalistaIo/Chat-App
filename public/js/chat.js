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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
// location.search contains query string part of URL
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

// const button = document.getElementById('increment');

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count);
// });

// button.onclick = () => {
//     socket.emit('increment');
// }

// new message
const autoscroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild;
    // height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageHeight = $newMessage.offsetHeight + parseInt(newMessageStyles.marginBottom) + parseInt(newMessageStyles.marginTop);

    // visible height
    const visibleHeight = $messages.offsetHeight;

    // height of messages container
    const containerHeight = $messages.scrollHeight;

    // how far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    };
};

// need to access template and location where template is inserted
socket.on('message', (mesg) => {
    const html = Mustache.render(messageTemplate, {
        message: mesg.text,
        createdAt: moment(mesg.createdAt).format('h:mm a'),
        username: mesg.username});
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

// display url as link
socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationTemplate, {
        location: location.text,
        createdAt: moment(location.text).format('h:mm a'),
        username: location.username});
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
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

// join event is emitted when someone joins specified chat room with specified username
socket.emit('join', {
    username,
    room
}, (error) => {
    if (error) {
        alert(error);
        location.href = './index.html';
    }
});

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
});