import React from "react";
import { Navigate } from "react-router-dom";
import "./design.css"


export default class EditPost extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            pid:localStorage.getItem("id"), //id of the element to be edited passed from the feed page
            goBack:false
            
        }
        this.edit=this.edit.bind(this)
        this.cancel=this.cancel.bind(this)
    }

    cancel(){ //this will redirect the page back into the feed page
        this.setState({goBack:true})
        localStorage.removeItem("id");
    }


    edit(){ //this will just fetch the necessary data into the edit-post endpoint
      
        const edit={
            id:this.state.pid,
            content:document.getElementById("newContent").value,
            isLoggedIn:null,
            checkedIfLoggedIn:false
  
        }

        fetch(
            "http://localhost:3001/edit-post",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(edit)
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("Failed to edit post"); }
                else { 
                    alert('Edited!');
                    this.setState({goBack:true})
                    localStorage.removeItem("id");
                   

                }})
        

    }

    componentDidMount() {
        // Send POST request to check if user is logged in
        fetch("http://localhost:3001/checkifloggedin",
          {
            method: "POST",
            credentials: "include"
          })
          .then(response => response.json())
          .then(body => {
            if (body.isLoggedIn) {
              this.setState({ checkedIfLoggedIn: true, isLoggedIn: true});
            } else {
              this.setState({ checkedIfLoggedIn: true, isLoggedIn: false });
            }
          });
      }
    
    
    
    render(){
        if(!this.state.checkedIfLoggedIn){
            return (<div></div>)

        }else{
            if(this.state.isLoggedIn){

                if(!this.state.goBack){
                    return(
                        <div className="editCont">
                            <div className="editPost">
                                <fieldset>
                                <textarea id='newContent' rows="4" cols='65' placeholder='Edit' ></textarea> <br /> <br />
                                    <button onClick={this.edit}> enter </button> <button onClick={this.cancel}>cancel</button>
                                </fieldset>
                            </div>
                        </div>
                    )
                }else{
                    return <Navigate to="/dashboard" />
                }
            }else{
                return <Navigate to ="/login" />
            }
            
        }
    }
}