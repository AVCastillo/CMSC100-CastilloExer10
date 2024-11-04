import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";


export default class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state={
      password:"",                 // this will be the state for the password field
      promptMatch: true ,           //this will be the state that will be used in prompting if the password and repeat password matches
      format: false,               //this will be the state for checking if the desired format for password is followed
      redirect: false
  }

    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.newPass= this.newPass.bind(this)               // lines ____ binds the following functions with the "this" keyword
    this.passwordFormat=this.passwordFormat.bind(this)
    this.check= this.check.bind(this)
  }

  newPass(n){                                      
    this.setState({password: n.target.value})   //sets the value of the state for password into the input string from the password field in the form
    this.passwordFormat(n)                     // calls the passwordFormat and passes  the current password input as its parameter
   
  }
  passwordFormat(password){                   //this will check if the password entered follows the desired format (this will be used for prompt/warning purposes only)

    const capital= /[A-Z]/;                // regex for all uppercase letters
    const number = /[0-9]/;                // regex for all numbers
    const small = /[a-z]/;                 // regex for all lowercase letters
    
    const len= password.target.value.length   //gets the length of the input password

    if(len>=8){ // this will ensure that the length of the input password is always >= 8
        const result= ((capital.test(password.target.value)) && (number.test(password.target.value)) && (small.test(password.target.value))) //this will find an occurence of an upper and lowercase letter and a number using the regex above
        console.log(result)                                                                                               // each test will return a boolean value, then if all 3 tests are true then the final value of result is true

        this.setState( {format: result});             //sets the format state into the value of the result
        this.setState({promptMatch:result})          // sets the promptmatch state into the value of the result (this is used for the error prompt in the pattern of passwords)
    }
  }

  check(){
    console.log(document.getElementById("s-password").value)
    this.passwordFormat(document.getElementById("s-password").value)
    
    
    
    if(document.getElementById("f-name").value !==''){
      this.signup()
    }

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
    if(user.firstName !== ''  && user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
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
        if(user.name ==='' && user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
            alert("name is empty")
        }else if(user.name !== "" && !user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
            alert("password didn't match the format")
        }
      }

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
            alert("Successfully logged in");
            this.setState({redirect : true});
            
        }
      })
  }

  render() {
    if(!this.state.redirect){
      return (
        <div>
          

          <h2>Sign Up</h2>
          <form id="form1">
            <input type="text" id="f-name" placeholder=" first name"  required/>&nbsp;
            <input type="text" id="s-name" placeholder=" last name"  required/>&nbsp;
            <input type="email" id="s-email" placeholder="Email" required />&nbsp;
            <input type="password" id="s-password" placeholder="password"  value={this.state.password} onChange={this.newPass} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$" required/>  {this.state.promptMatch === true ? "": "There should be atleast 1 uppercase letter, 1 lowercase letter and 1 number"}
            <button id="signup" type="submit" onClick={this.signup}>Sign Up</button>
          </form>

          <h2>Log In</h2>
          <form>
            <input type="text" id="l-email" placeholder="Email" />&nbsp;
            <input type="password" id="l-password" placeholder="password" />&nbsp;
            <button id="login"  onClick={this.login}>Log In</button>
          </form>
        </div>
      )
    }else{
      return <Navigate to="/dashboard" />
    }
  }
}