import React, { useEffect } from 'react'
import { Form, Button, Container, Col, Row } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { signup } from '../services/services'
function SignupForm(){
        const history = useHistory()
        var loggedin = localStorage.getItem("loggedin");

        // when any user try to access signin if they are loggedin then we redirect them to dashboard, they cannot signup as new user.
        useEffect(() => {
            if(loggedin === 'true'){
                history.push("/");
            }
        }, [history, loggedin])

        // addDetails function will be called when user clicks on Sign Up button
        const addDetails = () => {
            let firstName = document.getElementById('firstNameText').value
            let lastName = document.getElementById('lastNameText').value
            let email = document.getElementById('emailText').value
            let password = document.getElementById('passText').value
            let repassword = document.getElementById('repassText').value
            let username = document.getElementById("username").value
        
        // signup function will be called which is service, you can find this method in  services folder, inside services.js
            signup([firstName, lastName, email, password, repassword, username]).then( res => 
            {
                if(res.data.status === 200){
                    alert("Signup Successful")
                    return history.push("/signin");
                }
                else{
                    console.log("Signup Failed")
                    alert("please enter valid input")
                }
            })
        }
        return (
            <div>
                <Container className="pt-5"> 
                <h1 align="center">Registration</h1>
                        <Row className="mt-5">
                            <Col md={{ span: 3, offset: 3 }}>
                                <Form.Group>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" id="firstNameText" placeholder="Devang"></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={{ span: 3 }}>
                                <Form.Group>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" id="lastNameText" placeholder="Garach"></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" id="emailText" placeholder="devanggarach@gmail.com"></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Form.Group>
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" id="username" placeholder="devanggarach"></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" id="passText" placeholder="**********"></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Form.Group>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" id="repassText" placeholder="**********"></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Button variant="primary" onClick={ addDetails } className="btn btn-block">Sign up</Button>       
                            </Col>
                        </Row>
                        <Row className="pt-2">
                            <Col md={{ span: 6, offset: 3 }}>
                                <Link to="/signin" className="btn btn-warning btn-block">Login</Link>       
                            </Col>
                        </Row>
                </Container>
            </div>
        )
}
export default SignupForm