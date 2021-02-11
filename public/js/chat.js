const socket = io();
// const button = document.getElementById('increment');

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count);
// });

// button.onclick = () => {
//     socket.emit('increment');
// }

socket.on('message', (mesg) => {
    console.log(mesg);
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const mesg = e.target.elements.message.value;
    socket.emit('sendMessage', mesg);
});