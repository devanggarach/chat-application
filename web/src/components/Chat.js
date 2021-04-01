import React, { Component } from 'react'
import { Row,Col,Form} from 'react-bootstrap'
import io from "socket.io-client"
import moment from "moment";
import $ from "jquery";
import {Picker} from "emoji-mart";
import { HiOutlineDownload } from 'react-icons/hi';
import { baseURL } from '../services/config'
import { encrypt, decrypt } from '../services/secure';
import { download } from '../services/services';

const socket = io.connect(baseURL , {'transports': ['websocket', 'polling']})
class Chat extends Component {

    constructor(props){
        super(props)
        this.state={
            msg: "", file: null, chat: [], emojiPickerState: false
        }
    }

    componentDidMount = () => {
        // this function will works to scroll down upto last message
        this.scrollToBottom();

        // we receive message from node server and it will update state chat
        socket.on("message2", (value) => {
            if(value === null){
                // console.log("connection null passed");
            }else{
                this.setState({ chat: [...this.state.chat, value] });
            }
        });
    }

    // when new message arrives or someone send message at that time component will update and it scroll to bottom
    componentDidUpdate = () => {
        this.scrollToBottom();
    }
    
    // while typing text message it will change state
    onTextChange = e => {
        this.setState({ msg: e.target.value });
    }

    // when someon select file it will call convertToBase64 function
    onFileChange = async(e) => {
        const fileObj = e.target.files[0];
        const base64 = await this.convertToBase64(fileObj)
        const name = fileObj.name;
        this.setState({ file: { base64, name } });
    }

    // it will convert to base64 string format
    convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
    
            fileReader.onload = (result) => {
                resolve(fileReader.result)
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    // scrollToBottom is will scroll down smoothly
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    // onclick on emoji button it will call triggerPicker and change state emojiPickerState in boolean
    triggerPicker = (event) => {
        event.preventDefault();
        this.setState({ emojiPickerState: !this.state.emojiPickerState })
    }

    // passing emoji inside function for adding emoji between text.
    emojipassed = (emoji) => {
        var cursorPos = $('#mymsg').prop('selectionStart');
        var v = $('#mymsg').val();
        var textBefore = v.substring(0, cursorPos );
        var textAfter  = v.substring(cursorPos, v.length );
        this.setState({ msg: textBefore + emoji.native + textAfter })
    }

    // on message submit this function will get all required fields value
    onMessageSubmit = () => {
        var senderId = this.props.stateVal.senderId;
        var message = encrypt(this.state.msg);
        var file = this.state.file;
        var receiverId = this.props.stateVal.receiverId;
        var roomId = this.props.stateVal.roomId;
        var receiverUser = this.props.stateVal.receiverUser;
        var username = this.props.stateVal.username;
        this.setState({ emojiPickerState: !this.state.emojiPickerState })
        document.getElementById("myImage").value = null;
        if(this.state.msg !== "" && this.state.file !== null){
			socket.emit("message", { senderId, username, message, file, receiverId, roomId, receiverUser })
		}else if(this.state.msg){
            socket.emit("message", { senderId, username, message, receiverId, roomId, receiverUser })
        }else{
            socket.emit("message", { senderId, username, file, receiverId, roomId, receiverUser })
        }
        this.setState({ msg: "", file: null})
    }

    render() {
        var username = this.props.stateVal.username;
        var senderId = this.props.stateVal.senderId;
        var receiverUser = this.props.stateVal.receiverUser;
        var oldChat = this.props.stateVal.oldChat;
        var roomId = this.props.stateVal.roomId;
        var chat = this.state.chat;
        {
            // when user move to chat with different user, it will check roomId is same or not
            if(chat.length){
                if(roomId !== chat[0].roomId){
                    this.setState({ chat: []})
                }
            }
            
        }

        // emojiPicker render when someone click on emoji icons
        const emojiPicker = () => {
            if(this.state.emojiPickerState){
                return <Picker
                  title="Pick your emoji…"
                  emoji="point_up" style={{ position: 'absolute', bottom: '50px', right: '0px' }}
                  onSelect={ emoji => this.emojipassed(emoji) }
                />
            }
        }

        // it render the recent sent or received messages
        const renderCurrentChat=() => {
            return chat.length ? chat.map((e) => {
                // console.log(e)
                if(e.senderId !== senderId){
                    if(e.hasOwnProperty("message") && e.hasOwnProperty("fileURL")){
                        return <Row key={ e._id }>
                                    <div className="d-flex justify-content-start mb-1" style={ { width: "100%"} }>
                                        <div className="img_cont_msg">
                                            <img alt={ decrypt(receiverUser) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(receiverUser) }` } className="user_img_msg"/>
                                        </div>
                                        <div className="msg_cotainer">
                                            {
                                                decrypt(e.fileURL).split(".").includes("png") || decrypt(e.fileURL).split(".").includes("jpg") || decrypt(e.fileURL).split(".").includes("JPG") || decrypt(e.fileURL).split(".").includes("PNG") ? <img alt={ decrypt(e.fileURL) } src={ baseURL+"uploads/"+`${ e.roomId }`+"/"+`${ decrypt(e.fileURL) }`} style={{ width: "200px" }} />: decrypt(e.fileURL)
                                            }
                                        </div>
                                        <div className="msg_cotainer_download">
                                            <a onClick={ () => download(e.roomId, e.fileURL) } ><HiOutlineDownload/></a>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-start mb-4"  style={ { width: "100%"} }>
                                        <div className="img_cont_msg hide">
                                            <img alt={ decrypt(receiverUser) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(receiverUser) }` } className="user_img_msg"/>
                                        </div>
                                        <div className="msg_cotainer">
                                            { decrypt(e.message) }
                                            <span className="msg_time showHide">{ moment(e.createdAt).fromNow() }</span>
                                            <span className="msg_time hideShow">{ moment(e.createdAt).format("llll") }</span>
                                        </div>
                                    </div>
                                </Row>
                    }
                    else if(e.hasOwnProperty("message")){
                        return  <Row key={ e._id }>
                                <div className="d-flex justify-content-start mb-4"  style={{ flexDirection: "row" }}>
                                    <div className="img_cont_msg">
                                        <img alt={ decrypt(receiverUser) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(receiverUser) }` } className="user_img_msg"/>
                                    </div>
                                    <div className="msg_cotainer">
                                        { decrypt(e.message) }
                                        <span className="msg_time showHide">{ moment(e.createdAt).fromNow() }</span>
                                        <span className="msg_time hideShow">{ moment(e.createdAt).format("llll") }</span>
                                    </div>
                                </div>
                            </Row>
                    }
                    else{
                        return  <Row key={ e._id }>
                                <div className="d-flex justify-content-start mb-4"  style={{ flexDirection: "row" }}>
                                    <div className="img_cont_msg">
                                        <img alt={ decrypt(receiverUser) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(receiverUser) }` } className="user_img_msg"/>
                                    </div>
                                    <div className="msg_cotainer">
                                        {
                                            decrypt(e.fileURL).split(".").includes("png") || decrypt(e.fileURL).split(".").includes("jpg") || decrypt(e.fileURL).split(".").includes("JPG") || decrypt(e.fileURL).split(".").includes("PNG") ? <img alt={ decrypt(e.fileURL) } src={ baseURL+"uploads/"+`${ e.roomId }`+"/"+`${ decrypt(e.fileURL) }`} style={{ width: "200px" }} />: decrypt(e.fileURL)
                                        }
                                        <span className="msg_time showHide">{ moment(e.createdAt).fromNow() }</span>
                                        <span className="msg_time hideShow">{ moment(e.createdAt).format("llll") }</span>
                                    </div>
                                    <div className="msg_cotainer_download">
                                        <a onClick={ () => download(e.roomId, e.fileURL) } ><HiOutlineDownload/></a>
                                    </div>
                                </div>
                            </Row>
                    }
                }
                else{
                    if(e.hasOwnProperty("message") && e.hasOwnProperty("fileURL")){
                        return <Row key={ e._id }>
                                    <div className="d-flex justify-content-end mb-1" style={ { width: "100%"} }>
                                        <div className="msg_cotainer_download">
                                            <a onClick={ () => download(e.roomId, e.fileURL) } ><HiOutlineDownload/></a>
                                        </div>
                                        <div className="msg_cotainer_send">
                                            {
                                                decrypt(e.fileURL).split(".").includes("png") || decrypt(e.fileURL).split(".").includes("jpg") || decrypt(e.fileURL).split(".").includes("JPG") || decrypt(e.fileURL).split(".").includes("PNG") ? <img alt={decrypt(e.fileURL)} src={baseURL+"uploads/"+`${e.roomId}`+"/"+`${decrypt(e.fileURL)}`} style={{width:"200px"}} />: decrypt(e.fileURL)
                                            }
                                        </div>
                                        <div className="img_cont_msg">
                                            <img alt={ decrypt(username) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(username) }` } className="user_img_msg"/>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mb-4" style={ { width: "100%"} }>
                                        <div className="msg_cotainer_send">
                                            { decrypt(e.message) }
                                            <span className="msg_time_send text-right showHide">{ moment(e.createdAt).fromNow() }</span>
                                            <span className="msg_time_send text-right hideShow">{ moment(e.createdAt).format("llll") }</span>
                                        </div>
                                        <div className="img_cont_msg hide">
                                            <img alt={ decrypt(username) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(username) }` } className="user_img_msg"/>
                                        </div>
                                    </div>
                               </Row>
                    }
                    else if(e.hasOwnProperty("message")){
                        return  <Row key={ e._id }>
                                <div className="d-flex justify-content-end mb-4" style={ { width: "100%"} }>
                                    <div className="msg_cotainer_send">
                                    { decrypt(e.message) }
                                        <span className="msg_time_send text-right showHide">{ moment(e.createdAt).fromNow() }</span>
                                        <span className="msg_time_send text-right hideShow">{ moment(e.createdAt).format("llll") }</span>
                                    </div>
                                    <div className="img_cont_msg">
                                        <img alt={ decrypt(username) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(username) }` } className="user_img_msg"/>
                                    </div>
                                </div>
                            </Row>
                    }
                    else{
                        return  <Row key={ e._id }>
                                    <div className="d-flex justify-content-end mb-4" style={ { width: "100%"} }>
                                        <div className="msg_cotainer_download">
                                            <a onClick={ () => download(e.roomId, e.fileURL) } ><HiOutlineDownload/></a>
                                        </div>
                                        <div className="msg_cotainer_send">
                                            {
                                                decrypt(e.fileURL).split(".").includes("png") || decrypt(e.fileURL).split(".").includes("jpg") || decrypt(e.fileURL).split(".").includes("JPG") || decrypt(e.fileURL).split(".").includes("PNG") ? <img alt={ decrypt(e.fileURL) } src={ baseURL+"uploads/"+`${ e.roomId }`+"/"+`${ decrypt(e.fileURL) }`} style={{ width: "200px"}} />: decrypt(e.fileURL)
                                            }
                                            <span className="msg_time_send text-right showHide">{ moment(e.createdAt).fromNow() }</span>
                                            <span className="msg_time_send text-right hideShow">{ moment(e.createdAt).format("llll") }</span>
                                        </div>
                                        <div className="img_cont_msg">
                                        <img alt={ decrypt(username) }  src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(username) }` } className="user_img_msg"/>
                                        </div>
                                    </div>
                                </Row>
                    }
                }
            }) : ""
        }

        // it will render the messages which are loaded from database before starting chat
        const renderChat = () => {
            socket.emit("message",{ roomId } )
            
            return oldChat.length ? oldChat.map((e) => {
                if(e.senderId !== senderId){
                    if(e.hasOwnProperty("message") && e.hasOwnProperty("fileURL")){
                        return <Row key={ e._id }>
                                    <div className="d-flex justify-content-start mb-1" style={ { width: "100%"} }>
                                        <div className="img_cont_msg">
                                            <img alt={ decrypt(receiverUser) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(receiverUser) }` } className="user_img_msg"/>
                                        </div>
                                        <div className="msg_cotainer">
                                            {
                                                decrypt(e.fileURL).split(".").includes("png") || decrypt(e.fileURL).split(".").includes("jpg") || decrypt(e.fileURL).split(".").includes("JPG") || decrypt(e.fileURL).split(".").includes("PNG") ? <img alt={ decrypt(e.fileURL) } src={ baseURL+"uploads/"+`${ e.roomId }`+"/"+`${ decrypt(e.fileURL) }`} style={{ width: "200px" }} />: decrypt(e.fileURL)
                                            }
                                        </div>
                                        <div className="msg_cotainer_download">
                                            <a onClick={ () => download(e.roomId, e.fileURL) } ><HiOutlineDownload/></a>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-start mb-4"  style={ { width: "100%"} }>
                                        <div className="img_cont_msg hide">
                                            <img alt={ decrypt(receiverUser) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(receiverUser) }` } className="user_img_msg"/>
                                        </div>
                                        <div className="msg_cotainer">
                                            { decrypt(e.message) }
                                            <span className="msg_time showHide">{ moment(e.createdAt).fromNow() }</span>
                                            <span className="msg_time hideShow">{ moment(e.createdAt).format("llll") }</span>
                                        </div>
                                    </div>
                                </Row>
                    }
                    else if(e.hasOwnProperty("message")){
                        return  <Row key={ e._id }>
                                <div className="d-flex justify-content-start mb-4"  style={ { width: "100%"} }>
                                    <div className="img_cont_msg">
                                        <img alt={ decrypt(receiverUser) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(receiverUser) }` } className="user_img_msg"/>
                                    </div>
                                    <div className="msg_cotainer">
                                        { decrypt(e.message) }
                                        <span className="msg_time showHide">{ moment(e.createdAt).fromNow() }</span>
                                        <span className="msg_time hideShow">{ moment(e.createdAt).format("llll") }</span>
                                    </div>
                                </div>
                            </Row>
                    }
                    else{
                        return  <Row key={ e._id }>
                                <div className="d-flex justify-content-start mb-4" style={ { width: "100%"} }>
                                    <div className="img_cont_msg">
                                        <img alt={ decrypt(receiverUser) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(receiverUser) }` } className="user_img_msg"/>
                                    </div>
                                    <div className="msg_cotainer">
                                        {
                                            decrypt(e.fileURL).split(".").includes("png") || decrypt(e.fileURL).split(".").includes("jpg") || decrypt(e.fileURL).split(".").includes("JPG") || decrypt(e.fileURL).split(".").includes("PNG") ? <img alt={ decrypt(e.fileURL) } src={ baseURL+"uploads/"+`${ e.roomId }`+"/"+`${ decrypt(e.fileURL) }`} style={{ width: "200px" }} />: decrypt(e.fileURL)
                                        }
                                        <span className="msg_time showHide">{ moment(e.createdAt).fromNow() }</span>
                                        <span className="msg_time hideShow">{ moment(e.createdAt).format("llll") }</span>
                                    </div>
                                    <div className="msg_cotainer_download">
                                        <a onClick={ () => download(e.roomId, e.fileURL) } ><HiOutlineDownload/></a>
                                    </div>
                                </div>
                            </Row>
                    }
                }
                else{
                    if(e.hasOwnProperty("message") && e.hasOwnProperty("fileURL")){
                        return <Row key={ e._id }>
                                    <div className="d-flex justify-content-end mb-1" style={ { width: "100%"} }>
                                        <div className="msg_cotainer_download">
                                            <a onClick={ () => download(e.roomId, e.fileURL) } ><HiOutlineDownload/></a>
                                        </div>
                                        <div className="msg_cotainer_send">
                                            {
                                                decrypt(e.fileURL).split(".").includes("png") || decrypt(e.fileURL).split(".").includes("jpg") || decrypt(e.fileURL).split(".").includes("JPG") || decrypt(e.fileURL).split(".").includes("PNG") ? <img alt={ decrypt(e.fileURL) } src={ baseURL+"uploads/"+`${ e.roomId }`+"/"+`${ decrypt(e.fileURL) }`} style={{ width: "200px" }} />: decrypt(e.fileURL)
                                            }
                                        </div>
                                        <div className="img_cont_msg">
                                            <img alt={ decrypt(username) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(username) }` } className="user_img_msg"/>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mb-4" style={ { width: "100%"} }>
                                        <div className="msg_cotainer_send">
                                            { decrypt(e.message) }
                                            <span className="msg_time_send text-right showHide">{ moment(e.createdAt).fromNow() }</span>
                                            <span className="msg_time_send text-right hideShow">{ moment(e.createdAt).format("llll") }</span>
                                        </div>
                                        <div className="img_cont_msg hide">
                                            <img alt={ decrypt(username) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(username) }` } className="user_img_msg"/>
                                        </div>
                                    </div>
                               </Row>
                    }
                    else if(e.hasOwnProperty("message")){
                        // console.log("message")
                        return  <Row key={ e._id }>
                            
                                    <div className="d-flex justify-content-end mb-4" style={ { width: "100%"} }>
                                        <div className="msg_cotainer_send">
                                            { decrypt(e.message) }
                                            <span className="msg_time_send text-right showHide">{ moment(e.createdAt).fromNow() }</span>
                                            <span className="msg_time_send text-right hideShow">{ moment(e.createdAt).format("llll") }</span>
                                        </div>
                                        <div className="img_cont_msg">
                                            <img alt={ decrypt(username) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(username) }` } className="user_img_msg"/>
                                        </div>
                                    </div>
                                </Row>
                    }
                    else{
                        // console.log("fileURL")
                        return  <Row key={ e._id }>
                                <div className="d-flex justify-content-end mb-4" style={ { width: "100%"} }>
                                    <div className="msg_cotainer_download">
                                        <a onClick={ () => download(e.roomId, e.fileURL) } ><HiOutlineDownload/></a>
                                    </div>
                                    <div className="msg_cotainer_send">
                                        {
                                            decrypt(e.fileURL).split(".").includes("png") || decrypt(e.fileURL).split(".").includes("jpg") || decrypt(e.fileURL).split(".").includes("JPG") || decrypt(e.fileURL).split(".").includes("PNG") ? <img alt={ decrypt(e.fileURL) } src={ baseURL+"uploads/"+`${ e.roomId }`+"/"+`${ decrypt(e.fileURL) }`} style={{ width: "200px" }} />: decrypt(e.fileURL)
                                        }
                                        <span className="msg_time_send text-right showHide">{ moment(e.createdAt).fromNow() }</span>
                                        <span className="msg_time_send text-right hideShow">{ moment(e.createdAt).format("llll") }</span>
                                    </div>
                                    <div className="img_cont_msg">
                                        <img alt={ decrypt(username) } src={ "https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(username) }` } className="user_img_msg"/>
                                    </div>
                                </div>
                            </Row>
                    }
                }
            }) : ""
        }
        
        return (
            <Row>
                <Col md={12}>
                    <div style={{ height: "475px" }}>
                        <p> { decrypt(username) } is talking to { decrypt(receiverUser) }</p>
                        <div id="scrollDown">
                            <div className="pt-0 pl-3 pr-4 pb-0">
                                { renderChat() }
                            </div>
                            <div className="pt-0 pl-3 pr-4 pb-0">
                                { renderCurrentChat() }
                            </div>
                            <div ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                        </div>
                    </div>
                    <div className="pt-1" style={{ marginTop:"auto", marginBottom:0 }}>
                        <div hidden>
                            <input type ="text" name="senderId" disabled  value={ senderId } label="SenderId" />
                        </div>
                        <div className="p-1" hidden>
                            <Form.Control type="text" name="username" placeholder={ username } value={ username } readOnly/>
                        </div>
                        <div hidden>
                            <input type ="text" name="roomId" disabled  value={ roomId } label="RoomId" />
                        </div>
                        <div>
                            <input type="file" name="myImage" id="myImage" onChange={ e => this.onFileChange(e) } />
                        </div>
                        <Row className="p-2">
                            <Col md={9} className="p-0">
                                <Form.Control type="text" name="message" placeholder="enter your message....." id="mymsg" onChange={ e => this.onTextChange(e) } value={ this.state.msg } variant="outlined" label="Message"/>
                            </Col>
                            <span>{emojiPicker()}</span>
                            <Col md={1} className="p-0">
                                <button className="btn btn-white btn-block" onClick={ this.triggerPicker }>    
                                    <span role="img">
                                    🙂
                                    </span>
                                </button>
                            </Col>
                            <Col md={2} className="p-0">
                                <button className="btn btn-primary btn-block" onClick={ this.onMessageSubmit }>Send</button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default Chat