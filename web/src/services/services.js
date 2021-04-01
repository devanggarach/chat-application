import axios from 'axios';
import qs from 'qs';
import { baseURL } from './config'
import { encrypt,decrypt } from './secure';
import fileDownload from 'js-file-download';
/*
when request came here to signup, we take on parameter named userDetails,
once we get userDetails, by using axios we call api having "baseURL + signup/"
and it will goes to node server, for validation and return the result whatever it is.
*/
export const signup = async(userDetails)=>{
    // const header = {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}
    let [fname, lname, email, password, repassword, username] = userDetails;
    console.log(userDetails)
    const result = await axios({
        method:'post',
        url:baseURL+"signup/",
        data: qs.stringify({
            fname:encrypt(fname),
            lname:encrypt(lname),
            email:encrypt(email),
            repassword:encrypt(repassword),
            password:encrypt(password),
            username:encrypt(username)
        })
    })
    return result;
}

/*
when request came here for signin, we take on parameter named userDetails,
once we get userDetails having username and password, then after, by using axios we call api having "baseURL + signin/"
and it will goes to node server, for validation and return the result whatever it is.
*/
export const signin = async(userDetails)=>{
    // const header = {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}
    let [username, password] = userDetails;
    console.log(encrypt(username));
    const result = await axios({
        method:'post',
        url:baseURL+"login/",
        data: qs.stringify({
            password:encrypt(password),
            username:encrypt(username)
        })
    })
    return result;
}

/*
when request is made to fetchUsers, here we take one argument having id of current active user,
using axios, it will call api "baseURL+ 'fetch/'id", it will fetch all user from node server except the current user.
*/
export const fetchUsers =  async (id)=>{
    return await axios.get(baseURL+"fetch/"+id)
}

/*
when request is made to fetchUserById, to find username, here we take one argument, id.
and using axios, it will call api "baseURL + 'fetchuser/'+id", it will fetch username from node server/
*/
export const fetchUserById =  async (id)=>{
    return await axios.get(baseURL+"fetchuser/"+id)
}

/*
fetchRoom request is made when we have to verify that which roomId is already in database,
and using axios, it will call api having 'baseURL + fetchroom/ ',
if any roomId will found then we will return value of roomId, else it will return roomId1.
*/
export const fetchRoom =  async (senderId,receiverId)=>{
    // const header = {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}
    const result = await axios({
        method:'post',
        url:baseURL+"fetchroom/",
        data: qs.stringify({
            senderId:senderId,
            receiverId:receiverId
        })
    })
    return result;
}

/*
when user click for to chat with someone, at that time we call fetchChats and take three argument roomId, senderId, receiverId
and by using axios we call api, and node server return the result if any chats messages.
*/
export const fetchChats =  async (roomId,senderId,receiverId)=>{
    const result = await axios({
        method:'post',
        url:baseURL+"fetchchats/",
        data: qs.stringify({
            roomId:roomId,
            senderId:senderId,
            receiverId:receiverId
        })
    })
    return result;
}
export const offline = async (senderId) => {
    const result = await axios({
        method:'post',
        url:baseURL+"offline/",
        data:qs.stringify({
            senderId:senderId
        })
    })
    return result;
}
export const online = async (senderId) => {
    const result = await axios({
        method:'post',
        url:baseURL+"online/",
        data:qs.stringify({
            senderId:senderId
        })
    })
    return result;
}
export const download = (roomId, fileURL) => {
    const url=baseURL+"uploads/"+roomId+"/"+decrypt(fileURL);
    axios.get(url, {
      responseType: 'blob',
    }).then(res => {
        console.log(res.data)
      fileDownload(res.data, decrypt(fileURL));
    });
}