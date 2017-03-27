var socket = io.connect('/'),
    room_box = document.getElementsByClassName('roomcontainer'),
    message = document.querySelectorAll('textarea'),
    buttons = document.querySelectorAll('button'),
    names = {
        1: 'User',
        2: 'User',
        3: 'User'
    },
    typing,
    i;
socket.on('connect', function () {
    console.log('connected');
});
socket.on('disconnect', function () {
    console.log('disconnected');
});
for (i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
        var val = this.parentElement.getElementsByTagName('input')[0].value;
        if (val.length > 0) {
            names[this.getAttribute('data-target')] = val;
            socket.emit('room', this.getAttribute('data-target'));
            this.parentElement.remove();
        }
    };
}
for (i = 0; i < message.length; i++) {
    message[i].onkeypress = function (e) {
        var roomNumber = this.getAttribute('data-target'),
            name = names[roomNumber],
            chatbox = room_box[roomNumber - 1].getElementsByTagName('div')[0].getElementsByTagName('div')[0];
        if (e.keyCode == 13) {
            var d = new Date(),
                h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours(),
                m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
                time = '[' + h + ":" + m + ']';
            socket.emit('message', {
                name: name,
                message: this.value,
                room: roomNumber,
                time: time
            });
            var p = document.createElement('p');
            p.style.background = '#f2e5e2';
            p.innerHTML = '<span class="label"><span class="time">' + time + '</span>' + name + '</span><span class="message going">' + this.value + "</span>";
            chatbox.appendChild(p);
            this.value = '';
        } else {
            socket.emit('typing', {
                name: name,
                room: roomNumber
            });
        }
    };
}
socket.on('message', function (obj) {
    var p = document.createElement('p'),
        chatbox = room_box[obj.room - 1].getElementsByTagName('div')[0].getElementsByTagName('div')[0];
    p.innerHTML = '<span class="label"><span class="time">' + obj.time + '</span>' + obj.name + '</span><span class="message coming">' + obj.message + "</span>";
    chatbox.appendChild(p);
});
socket.on('typing', function (obj) {
    var aside = room_box[obj.room - 1].getElementsByClassName('rooms')[0].getElementsByTagName('aside')[0];
    aside.textContent = obj.name + ' is typing...';
    aside.style.display = 'block';
    typing = setTimeout(function () {
        aside.style.display = 'none';
        clearTimeout(typing);
    }, 2000);
});