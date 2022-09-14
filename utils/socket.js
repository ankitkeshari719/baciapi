const { Server }= require('socket.io');
const io = new Server(
    {
        cors: {
        origin: '*',
      }
    }
);

var Socket = {
    emit: function (event, data) {
        console.log(event, data);
        io.sockets.emit(event, data);
    }
};

io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
});

exports.Socket = Socket;
exports.io = io;