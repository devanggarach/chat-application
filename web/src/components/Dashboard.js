import React, { Component } from 'react'
import { Container,Row,Col,Navbar,Nav,ListGroup} from 'react-bootstrap'
import {fetchChats, fetchRoom, fetchUsers} from '../services/services'
import Chat from "./Chat"
import moment from "moment"
import io from "socket.io-client"
import { baseURL } from '../services/config'
import update from "react-addons-update"
import { decrypt } from '../services/secure'
const socket = io.connect(baseURL , {'transports': ['websocket', 'polling']});

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            users:[],
            senderId: localStorage.getItem("senderId"),
            username: localStorage.getItem("username"),
            receiverId: 0,
            receiverUser: "",
            roomId:0
        };
        
        fetchUsers(this.senderId).then(
            res => { this.setState({ users: [res.data.message] }) }
        )
    }
    
    // when user click on logout button it will update offline and redirect to signin page
    logoutHandler = () => {
        localStorage.setItem("loggedin", false);
        this.props.history.push('/signin')
    }

    senderId = localStorage.getItem("senderId");
    username = localStorage.getItem("username");

    // handleinput will be called when user click on user from list
    handleInput(id, username){
        localStorage.setItem("receiverId", id);
        localStorage.setItem("receiverUser", username);
        fetchRoom(this.senderId, id).then(
            res=> {
            fetchChats(res.data.message, this.senderId, this.receiverId).then(
                result => {
                this.setState({ receiverId: id, receiverUser: username, roomId: res.data.message, oldChat: result.data.message });
            })
        })
    }

    // it will call before and after page load once
    componentDidMount(){
        const senderId = this.senderId;
        window.addEventListener('beforeunload', async (event) => {
            const isOnline = false;
            socket.emit("isOnline",{ senderId, isOnline } );
            event.preventDefault();
        });
        window.addEventListener('load', async (event) => {
            const isOnline = true;
            socket.emit("isOnline",{ senderId, isOnline } );
            event.preventDefault();
            
        });
        socket.on("isOnline",(value) => {
            const {users} = this.state
            users[0].map( ( e, index ) => {
                if(e._id === value.senderId)
                {
                    this.setState(update(this.state, {
                        users: {
                          [0]: {
                            [index]:{
                                isOnline:{
                                    $set: value.isOnline
                                }
                            }
                          }
                        }
                      })
                    )
                }
            })
            
        })
    }
    render() {

        const { users,receiverId } = this.state
        
        return users.length ? (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#"><img className="ui avatar image" alt={ decrypt(this.username) } src={ "https://ui-avatars.com/api/?name="+decrypt(this.username) }/>{ decrypt(this.username) }</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto"/>
                        <Nav.Link onClick={ e => this.logoutHandler(e) } className="btn btn-danger">Logout</Nav.Link>
                    </Navbar.Collapse>
                </Navbar>
                <Container fluid>
                    <Row className="bodyBg">
                        <Col md={3} className="p-0">
                            <h4 className="mb-0 pl-4">List of users</h4><hr className="m-0"/>
                            <ListGroup variant="flush" defaultActiveKey="#link1">
                                {
                                    users[0].map((e) => {
                                        if(e.isOnline){
                                            return  <ListGroup.Item key={ e._id } onClick={ () => this.handleInput(e._id, e.username) } action href={ "#"+`${ e.username }` }>
                                                    <div class="d-flex bd-highlight">
                                                        <div class="img_cont">
                                                            <img alt={ decrypt(e.username) } src={"https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(e.username) }`}/>
                                                            <span class="online_icon"></span>
                                                        </div>
                                                        <div class="user_info">
                                                            <span>{ decrypt(e.username) }</span>
                                                            <p>Online</p>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                        }
                                        else{
                                            return  <ListGroup.Item key={ e._id } onClick={ () => this.handleInput(e._id, e.username) } action href={ "#"+`${ e.username }` }>
                                                    <div class="d-flex bd-highlight">
                                                        <div class="img_cont">
                                                            <img alt={ decrypt(e.username) } src={"https://ui-avatars.com/api/?rounded=true&name="+`${ decrypt(e.username) }`}/>
                                                            <span class="offline_icon"></span>
                                                        </div>
                                                        <div class="user_info user">
                                                            <span>{ decrypt(e.username) }</span><br/>
                                                            <span class="showHide sw">Offline</span>
                                                            <span class="hideShow sw">{moment(e.updatedAt).format("llll")}</span>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                        }
                                    })
                                }
                            </ListGroup>
                        </Col>
                        <Col md={9}>
                            { receiverId === 0 ? "" : <Chat stateVal={ this.state }></Chat> }
                        </Col>
                    </Row>
                </Container>
            </div>
        ) : <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
    }
}

export default Dashboard