const { Server }= require('socket.io');
const io = new Server(
    {
        cors: {
        origin: '*',
      }
    }
);

var Socket = {
    emit: function (event, room, data) {
        console.log(event, data);
        io.sockets.in(room).emit(event, data);
    }
};

io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on('retro', function(retroId) {
        console.log("making user join retroid rom",retroId)
        
        socket.join(retroId);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
});

exports.Socket = Socket;
exports.io = io;