import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./design.css";
import loginbg from "./pics/signinPic.jpg"


export default class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            redirect:false,
            goBacksign:false
        }
        this.login=this.login.bind(this)
        this.searchName=this.searchName.bind(this)
        this.gobackSignup=this.gobackSignup.bind(this)

    }
    
    searchName(email){  //this will get the full name of current loggein user which will be used for displaying posts later
      
      fetch(
        "http://localhost:3001/search-people",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
        })

        .then(response => response.json())
        .then(body => {
            if (!body.success) { alert("there are no the posts"); }
            else { 
                const len=body.people.length
               
                for (let i=len-1; i>=0; i--){
                    if(body.people[i].email === email){
                      const fullName=body.people[i].firstName.concat(" ", body.people[i].lastName)
                      console.log(fullName)
                      localStorage.setItem("full-name",fullName)
                    }
                }
            }})
    }

    gobackSignup(){
      this.setState({goBacksign:true})
    }
    

    login(e) {
        e.preventDefault();
    
        const credentials = {
          email: document.getElementById("l-email").value,
          password: document.getElementById("l-password").value
        }
        
    
        // Send a POST request
        fetch(
          "http://localhost:3001/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
          })
          .then(response => response.json())
          .then(body => {
            if (!body.success) { alert("Failed to log in"); }
            else {
              // successful log in. store the token as a cookie
    
              const cookies = new Cookies();
              cookies.set(
                "authToken",
                body.token,
                {
                  path: "localhost:3001/",
                  age: 60*60,
                  sameSite: "lax"
                });
                localStorage.setItem("email", body.email);
                localStorage.setItem("loggedinID", body.id);
                this.searchName(body.email)
                alert("Successfully logged in");
                this.setState({redirect : true});
                
                
                
            }
          })
      }
   
    render(){
        if(!this.state.redirect && !this.state.goBacksign){
            return (
              <div className="wholeLogin">
                <div className="landing-image">
                  <img src={loginbg} className="login-bg"/>
                </div>


                <div className="login-form-cont">
                  <h1 className="title-login">Log In</h1>
                  <form className="login-form">
                    <input type="text" className="input-login" id="l-email" placeholder="Email" />
                    <input type="password" className="input-login" id="l-password" placeholder="password" />
                  </form>

                  <div className="login-button">
                      <button className="input-login" id="login"  onClick={this.login}>Log In</button>
                      <button className="input-login" onClick={this.gobackSignup}> Back </button>
                </div> 
                 
                </div>
              
                
              </div>
            )
          }else if(this.state.redirect){
            return <Navigate to="/dashboard" />
          }else if(this.state.goBacksign){
            return <Navigate to="/" />
          }
    }
}