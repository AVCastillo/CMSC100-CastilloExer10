import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import './design.css'
import bg from "./pics/signinPic.jpg"


export default class SignIn extends React.Component{
    constructor(props) {
        super(props);
        this.state={
          redirect: false
        }

        this.signup = this.signup.bind(this);
        this.goLogin=this.goLogin.bind(this);
       
    }

   
    signup(e) {
        e.preventDefault();
    
        // this.passwordFormat(document.getElementById("s-password").value)
        
        const user = {
          firstName: document.getElementById("f-name").value,
          lastName: document.getElementById("s-name").value,
          email: document.getElementById("s-email").value,
          password: document.getElementById("s-password").value
        }
        console.log(this.state.password)
       
    
        // send a POSt request to localhost:3001/signup
        if(user.firstName !== ''  && user.lastName!=='' && user.email.match(/.+@.+/) && user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
          fetch(
            "http://localhost:3001/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(body => {
              if (body.success) { alert("Successfully saved user"); document.getElementById("form1").reset(); this.setState({password:""}) }
              else { alert("Failed to save user"); }
            });
         
          }else{
            if(user.firstName ==='' && user.lastName!=='' && user.email.match(/.+@.+/) && user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
                alert("Missing first name!")
            }else if(user.name !=='' && user.lastName==='' && user.email.match(/.+@.+/) && user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
                alert("Missing last name")
            }else if(user.name !=='' && user.lastName!=='' && !user.email.match(/.+@.+/) && user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
              alert("Invalid email format")
            }else if(user.name !=='' && user.lastName!=='' && user.email.match(/.+@.+/) && !user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
              alert("Invalid password format!")
            }else if(user.name !=='' && user.lastName!=='' && !user.email.match(/.+@.+/) && !user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
              alert("Invalid password and email format!")
            }else{
              alert('Fill out all fields')
            }

          }
    
      }

      goLogin(){
        this.setState({redirect:true})
      }

    
    render(){
        if(!this.state.redirect){
            return (
            <div id="wholeSign">

              <div className="landing-image">
                <img src={bg} className="beach"/>
              </div>


              <div className="form-container">
                <h1>Sign Up</h1>
                <form className="form1" id="form1">
                    <input type="text" className="input" id="f-name" placeholder="First Name"  required/>
                    <input type="text" className="input" id="s-name" placeholder="Last name"  required/>
                    <input type="email" className="input" id="s-email" placeholder="Email" required />
                    <input type="password" className="input" id="s-password" placeholder="Password"  value={this.state.password} onChange={this.newPass} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$" required/>
                </form>
                <div className="sl-button">
                    <button id="signup" type="submit" onClick={this.signup}>Sign Up</button>
                    <button id="goLogin" onClick={this.goLogin}> Go login</button>
                  </div>
              </div>
              
              
              
            </div>    
             )
        }else{
            return <Navigate to="/login" />
        }


        
    }
}