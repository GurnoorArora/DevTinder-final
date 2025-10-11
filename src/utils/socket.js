const socket=require('socket.io');
const Message=require('../models/message.js');
const initiateSocketConnection=(server)=>{
    const io=socket(server,{
        cors:{
            origin:"http://localhost:5173",
        }
    });

    io.on('connection',(socket)=>{
        //handle events
        socket.on('joinChat',({firstName,userId,targetUserId})=>{
            const roomId=[userId,targetUserId].sort().join("-");
            console.log(`${firstName} joined the chat: ${roomId}`);
            socket.join(roomId);

            
        })
        socket.on('sendMessage', async ({firstName,userId,targetUserId,text})=>{

        try{
            const roomId=[userId,targetUserId].sort().join("-");
            //store this message in the database
            const message=new Message({
                roomId,
                senderId:userId,
                receiverId:targetUserId,
                text
            });
            await message.save();
            io.to(roomId).emit('messageReceived',{
                text,
                firstName,
                userId
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

        socket.on('disconnect',()=>{
            console.log('User disconnected');

        })

        
    });
}

module.exports=initiateSocketConnection;