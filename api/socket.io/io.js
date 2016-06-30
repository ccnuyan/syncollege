var socket = require('socket.io');
var snapshotService = require('./submissionService');
//Usage
// // sending to sender-client only
//  socket.emit('message', "this is a test");
//
//  // sending to all clients, include sender
//  io.emit('message', "this is a test");
//
//  // sending to all clients except sender
//  socket.broadcast.emit('message', "this is a test");
//
//  // sending to all clients in 'game' room(channel) except sender
//  socket.broadcast.to('game').emit('message', 'nice game');
//
//  // sending to all clients in 'game' room(channel), include sender
//  io.in('game').emit('message', 'cool game');
//
//  // sending to sender client, only if they are in 'game' room(channel)
//  socket.to('game').emit('message', 'enjoy the game');
//
//  // sending to all clients in namespace 'myNamespace', include sender
//  io.of('myNamespace').emit('message', 'gg');
//
//  // sending to individual socketid
//  socket.broadcast.to(socketid).emit('message', 'for your eyes only');

module.exports = function(app) {
    var io = socket.listen(app);
    console.log('socket.io is running');

    io.sockets.on('connection', function(socket) {
        console.log('client connected');

        socket.on('join_snapshot', function(event) {
            console.log({
                join_snapshot: event
            });
            socket.join(event.snapshot);
            snapshotService.getSnapshotSubmissions(event.snapshot, function(err, data) {
                Array.prototype.forEach.call(data, function(sm) {
                    socket.emit('listenerDecisionChanged', sm);
                });
            });
        });

        socket.on('slidechanged', function(event) {
            console.log({
                slidechanged: event
            });
            //  // sending to all clients in 'game' room(channel) except sender
            socket.broadcast.to(event.snapshot).emit('slidechanged', event);
        });

        socket.on('listenerDecisionChanged', function(event) {
            console.log({
                listenerDecisionChanged: event
            });
            snapshotService.updateSumbmisson(event, function(err, data) {
                if (err) {
                    console.log(err);
                }
                io.in(event.snapshot).emit('listenerDecisionChanged', data);
            });
        });


        // socket.on('messageReceived', function(event) {
        //     console.log({
        //         messageReceived: event
        //     });
        //     snapshotService.updateSumbmisson(event, function(err, data) {
        //         if (err) {
        //             console.log(err);
        //         }
        //         io.in(event.snapshot).emit(messageReceived, 'cool game');
        //     });
        // });
    });
};
