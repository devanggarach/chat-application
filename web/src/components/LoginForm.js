import React, { Component } from 'react'
import { Form, Button, Container, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import io from "socket.io-client"
import { baseURL } from '../services/config';
import { signin } from '../services/services'
const socket = io.connect(baseURL , {'transports': ['websocket', 'polling']});
class LoginForm extends Component {
    constructor(props){
        super(props)
        var loggedin = localStorage.getItem("loggedin");
        if(loggedin === 'true'){
            this.props.history.push('/')
        }
    }
    checking = () => {
        let username=document.getElementById("userTextForm").value
        let password=document.getElementById("passTextForm").value
        
        if(username === "" || password === ""){
            alert("please enter username and password")
        }
        else{
           (async() => {
            await signin([username, password]).then(res=>
            {
                if(res.data.status === 200){
                    console.log(res.data)
                    localStorage.setItem("loggedin", true);
                    localStorage.setItem("username", res.data.message.username);
                    localStorage.setItem("senderId", res.data.message._id);
                    localStorage.setItem("receiverId", 1111)
                    const senderId = res.data.message._id;
                    const isOnline = true;
                    socket.emit("isOnline",{ senderId, isOnline } );
                    this.props.history.push('/')
                }
                else{
                    console.log("login failed")
                    return alert("Please enter valid email id or password")
                }
            });
           })();
        }
    }
    
    render() {
        return (
            <div>
                <Container>
                    <Row className="mt-5">
                        <Col md={{ span: 4, offset: 4 }}>
                            <Form>
                                <h1 className="pb-3" align="center">Sign In</h1>
                                <Form.Group>
                                    <Form.Label> username </Form.Label>
                                    <Form.Control type="text" tabIndex="1" placeholder="Enter username" id="userTextForm" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label> password </Form.Label>
                                    <Form.Control type="password" tabIndex="2" placeholder="Password" id="passTextForm"/>
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox">
                                    <a href="" tabIndex="5">Forgot Password?</a>
                                </Form.Group>
                                <Button onClick={ () => this.checking() } variant="primary" tabIndex="3" className="btn-block">
                                    Sign In
                                </Button>
                                <Link to="/signup" className="btn btn-warning btn-block" tabIndex="4">Register</Link>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
export default LoginForm