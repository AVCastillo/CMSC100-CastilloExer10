import React from "react";
import { Navigate } from "react-router-dom";
import "./design.css"

export default class searchPeople extends React.Component{
    constructor(props){
        super(props)
        this.state={
            people:[],
            details:[],
            input:"",
            goView:false,
            isLoggedIn:null,
            checkedIfLoggedIn:false
        }
        this.goSearch=this.goSearch.bind(this)
    }
    
    geTid(index){

        const userId = this.state.details[index].id  //this will get the id of the user that was clicked
        localStorage.setItem("userID",userId)  //sets its userid as an item in the local storage which will be accessed in the viewPerson
        this.setState({goView:true}) //this will redirect to the viewPerson page
    }

    goSearch(){  //searhes for the user entered in the text input
        const findWho= document.getElementById("find").value
        this.setState({input:findWho}) //sets the input state into the name collected from the input field
        console.log(findWho)
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
                    
                    const arr=[]
                    const arr2=[]
                    const len=body.people.length
                    console.log(body.people.length)
                    
                    

                    for (let i=len-1; i>=0; i--){
                        if(body.people[i].firstName === this.state.input || body.people[i].lastName=== this.state.input || body.people[i].firstName.concat(" ",body.people[i].lastName) ===this.state.input ){
                            arr.push(body.people[i].firstName.concat(" ",body.people[i].lastName)) //gets array of the full names of users that follows the condition above
                            arr2.push({id:body.people[i]._id, email:body.people[i].email}) //gets arrayof id and email of users that follows the condition above
                        }
                    }
                    this.setState({people:arr}) // this will be use for displaying the result names of users
                    this.setState({details:arr2}) //this will be used for viewing a specific user
                    
                    console.log(arr.length)
                    console.log(this.state.input)
                    console.log(arr)


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

      canceL(){
        window.location.reload(true)
      }
    
    render(){
        if(!this.state.checkedIfLoggedIn){
            return (<div></div>)
        }else{
            if(this.state.isLoggedIn){
        

                if(!this.state.goView){
                    return(
                        <div className="Search"> 
                            <button className="buttonSearch1" onClick={this.goSearch}>Search</button>
                            <input className="inputSearch" type="text" id="find" placeholder="Search People" />
                            
                            <button className="buttonSearch2" onClick={this.canceL} >X</button>
                            
                            <br />
                            <br />
                            <br />
                            <div className="searchOutput">
                                {
                                    this.state.people.map((person,index)=>{
                                        return <li key={index}> <fieldset> {person} <button onClick={this.geTid.bind(this,index)}> View profile</button></fieldset> </li>
                                    })
                                }
                            </div>
                        
                        </div>
                    )
                }else{
                    return <Navigate to="/viewPerson"/>
                }
            }else{
                return <Navigate to="/login" />
            }
        }        
    }


}