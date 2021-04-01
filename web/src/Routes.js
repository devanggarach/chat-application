import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Dashboard from './components/Dashboard'
// import Chat from './components/Chat'
function Routes() {
    // I declared loggedin to check user is already logged-in to the system or not, if user is logged-in then we redirect them to dashboard
    var loggedin= localStorage.getItem("loggedin")==='true'
    return (
        // all routing path are defined
        <BrowserRouter forceRefresh={true}>
            {/* signup path will call the SignupForm component which was inside component folder */}
            <Route path="/signup" component={SignupForm}/>
            {/* '/'path will call the Dashboard component if user is loggedin else it will give blank and it will redirect to login page */}
            <Route exact path="/" render={() => loggedin && ( <Route component={Dashboard} />)} />
            {/* signin path will be call the LoginForm component which was inside component folder */}
            <Route path="/signin" component={LoginForm}/>
            {/* chat/:id  here Id will be passed, if user is loggedin if they select any user then it will redirect to the Chat component */}
            {/* <Route path="/chat/:id" component={Chat}/> */}
        </BrowserRouter>
    )
}

export default Routes
