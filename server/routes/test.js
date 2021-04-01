const sendFirstMessage =(senderId,username,message,receiverId,roomId, receiverUser) =>{
    // const socketRef.current = io.connect("http://localhost:4000" , {'transports': ['websocket', 'polling']})
    if(count==0){
        console.log(count==0)
        console.log("first time");
        socketRef.current.emit("message", {
            senderId,username,receiverId,roomId, receiverUser
        })
        setCount(1);
    }
    console.log(count)
}

console.log(chatArr[0][0]._id,value._id)
chatArr[0].forEach(x => {
    console.log(x._id,"<<<<<<<<<<<<<<<<<",value._id)
    if(x._id===value._id){
        chatArr[0].push(value)        
    }
});
chatArr[0].push(value)    