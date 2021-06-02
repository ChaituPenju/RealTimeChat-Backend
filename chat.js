
/**
 * @author Chaitanya Penjuri
 * @email chaitanya.penjuri95@gmail.com
 * @create date 2021-05-31
 * @modify date 2019-06-02
 * @desc socket.io chat server !
 */

const express = require('express'),
    app = express(),
    io = require('socket.io')(app.listen(3000,()=>{
        console.log('Server is running on port number 3000')
    }))

io.on('connection', (socket) => {
    
    console.log(`Connection : SocketId = ${socket.id}`)
       
    var userName = ''
    
    socket.on('subscribe', function(data) {
        console.log('on subscribed!')

        const room_data = JSON.parse(data)
        userName = room_data.userName
        const roomName = room_data.roomName
    
        socket.join(`${roomName}`)
        console.log(`Username : ${userName} joined Room Name : ${roomName}`)
        
        socket.broadcast.to(`${roomName}`).emit('newUserToChatRoom', userName)

    })

    socket.on('unsubscribe',function(data) {
        console.log('on unsubscribed!')

        const room_data = JSON.parse(data)

        const userName = room_data.userName
        const roomName = room_data.roomName
    
        console.log(`Username : ${userName} leaved Room Name : ${roomName}`)
        socket.broadcast.to(`${roomName}`).emit('userLeftChatRoom',userName)

        socket.leave(`${roomName}`)
    })

    socket.on('newMessage',function(data) {
        console.log('newMessage triggered')

        const messageData = JSON.parse(data)
        const messageContent = messageData.messageContent
        const roomName = messageData.roomName

        console.log(`[Room Number ${roomName}] ${userName} : ${messageContent}`)
        
        const chatData = {
            userName : userName,
            messageContent : messageContent,
            roomName : roomName
        }

        socket.broadcast.to(`${roomName}`).emit('updateChat',JSON.stringify(chatData))
    })

    //If you want to add typing function you can make it like this.
    
    // socket.on('typing',function(roomNumber){ //Only roomNumber is needed here
    //     console.log('typing triggered')
    //     socket.broadcast.to(`${roomNumber}`).emit('typing')
    // })

    // socket.on('stopTyping',function(roomNumber){ //Only roomNumber is needed here
    //     console.log('stopTyping triggered')
    //     socket.broadcast.to(`${roomNumber}`).emit('stopTyping')
    // })

    socket.on('disconnect', function () {
        console.log("One of sockets disconnected from the server.")
    })
})