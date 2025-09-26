const socket=require('socket.io');

const initiateSocketConnection=(server)=>{
    const io=socket(server,{
        cors:{
            origin:"http://localhost:5173",
        }
    });

    io.on('connection',(socket)=>{
        //handle events
        socket.on('joinChat',()=>{
            
        })
        socket.on("SendMessage",(data)=>{
        })

        socket.on('disconnect',()=>{
        })
        
        
    });
}

module.exports=initiateSocketConnection;