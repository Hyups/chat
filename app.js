var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var userList = [];

app.get('/', function(req, res) {
    res.sendfile('index.html');
});


io.on('connection', function(socket) {
    var joinedUser = false;
    var nickname;

    
    socket.on('join', function(data) {
        if (joinedUser) {
            return false;
        }
        nickname = data;
        userList.push(nickname);
        socket.broadcast.emit('join', {
            nickname: nickname,
            userList: userList
        });
        joinedUser = true;
    });
    socket.on('chat message', function(data) {
        io.emit('chat message', {
            nickname: nickname,
            msg: data
        });
    });
    socket.on('disconnect', function() {
        if (!joinedUser) {
            return false;
        }
        var i = userList.indexOf(nickname);
        userList.splice(i, 1);
        socket.broadcast.emit('left', {
            nickname: nickname,
            userList: userList
        });
    });
});


http.listen(3000, function() {
    console.log('listening on *:3000');
});
