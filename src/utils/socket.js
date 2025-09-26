const socket=require('socket.io');

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
        socket.on("SendMessage",({firstName,userId,targetUserId,text})=>{
            const roomId=[userId,targetUserId].sort().join("-");
            console.log(`Message from ${firstName} in room ${roomId}: ${text}`);
            io.to(roomId).emit("ReceiveMessage",{
                text,
                firstName,
                userId
            });
        })

        socket.on('disconnect',()=>{
        })

        
    });
}

module.exports=initiateSocketConnection;