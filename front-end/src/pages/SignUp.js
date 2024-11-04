import React from 'react';


class SignUp extends React.Component{
    constructor(props){
        super(props)

        this.state={
            password:"",                 // this will be the state for the password field
            repeat: "",                  //this will be the state for the repeat password field
            disable: true,               // this will be the state for disabling/ enabling the repeat password field
            format: false,               //this will be the state for checking if the desired format for password is followed
            promptMatch: true            //this will be the state that will be used in prompting if the password and repeat password matches
        }
       
        this.newPass= this.newPass.bind(this)               // lines 16-19 binds the following functions with the "this" keyword
        this.repPass=this.repPass.bind(this)
        this.handleDisable=this.handleDisable.bind(this)
        this.passwordFormat=this.passwordFormat.bind(this)
        
        
    }
    
    newPass(n){                                      
        this.setState({password: n.target.value})   //sets the value of the state for password into the input string from the password field in the form
        this.handleDisable(n)                       // calls the handleDisable and passes  the current password input as its parameter
        this.passwordFormat(n)                     // calls the passwordFormat and passes  the current password input as its parameter
       
    }

    
    repPass(n){
        this.setState({repeat : n.target.value})  // sets the value of the repeat password into the value from the repeat password field in the form
    }

    handleDisable(d){                            // this will set the disable state into false whenever the parameter d is not empty
        if(d !== ""){
            this.setState({disable:false})        //this state will be use later in the code in order to enable the repeat password field
        }
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

    

    render(){
        console.log(this.state.password);
        
        return(
     
        <div> 
            <form id='F'> 
                <label>First Name: </label><input type="text" required/>
                <br />
                <label>Last Name: </label><input type="text" required/>
                <br />
                <label>Email: </label><input type="email" required/>
                <br />
                <label>Password: </label><input type="password"   value={this.state.password} onChange={this.newPass} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$" required/>  {this.state.promptMatch === true ? "": "There should be atleast 1 uppercase letter, 1 lowercase letter and 1 number"}
                <br />
                
                <label>Repeat Password: </label><input type="password"  value={this.state.repeat} onChange={this.repPass} pattern={this.state.password} disabled={this.state.disable} required />  {this.state.password === this.state.repeat  ? "" : "not match"}
                <br />


                <button> Sign Up </button>
                
            </form>
             
               
            
        </div>
        )
    }

}

export default SignUp