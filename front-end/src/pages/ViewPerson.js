import React from "react";
import { Navigate } from "react-router-dom";

export default class ViewPerson extends React.Component{
    constructor(props){
        super(props)
        this.state={
            userId:localStorage.getItem("userID"), //id of the person/profile you viewed
            userEmail:'',
            firstname:'',
            lastname:'',
            goBack:false,
            isLoggedIn:null,
            checkedIfLoggedIn:false,
            currentEmail:localStorage.getItem("email"),
            requestSender:[],
            friendsList:[],
            requestSent:false,
            cantAddUrself:false,
            friend:false,
            toAccept:[]

        }
        this.goHome=this.goHome.bind(this)
        this.vieW=this.vieW.bind(this)
        this.getUserRequest=this.getUserRequest.bind(this)
        this.addFriend=this.addFriend.bind(this)
        this.friendtoAccept=this.friendtoAccept.bind(this)
        
    }

    goHome(){
        localStorage.removeItem("userID")
        this.setState({goBack:true})
    }

    vieW(){   //this will search for all users in the database then filters them with the id of the person/profile that is currently viewed in order to get the necessary details for viewing the profile

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
                    // this.setState({posts:body.post})
                    
                    const len=body.people.length
                   
                    for (let i=len-1; i>=0; i--){
                        if(body.people[i]._id === this.state.userId){
                           
                            this.setState({userEmail:body.people[i].email, firstname:body.people[i].firstName, lastname: body.people[i].lastName,toAccept:body.people[i].toAccept})
                            console.log(this.state.toAccept)
                        }
                    }
                }})
    }

    addFriend(requests){  //this will be fetched into the add-friend end point
        const add={
            email:this.state.currentEmail,   //this will be the filter for searching the user
            request:requests                 // this will add the id of the user you requested to add into the array of requests of the current user loggedin
        }

        fetch(
            "http://localhost:3001/add-friend",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(add)
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("Failed request"); }
                else { 
                    alert('Friend request sent!');

                }})
    }

    friendtoAccept(pending){ //this will update the toAccept field of the user that received a friend request
        const pendingAccept=[]
        const len=pending.length
        for(let i=0;i<len;i++){
            pendingAccept.push(pending[i])  //copies the elements of the pending array 
        }
        console.log(pendingAccept)
        pendingAccept.push(localStorage.getItem("loggedinID")) //adds the friend request sender's id into the pendingAccept array

        const toAccept={
            email:this.state.userEmail, //this is the email of the request receiver (filter)
            request:pendingAccept       //sets the value of pendingAccept as the new value of toAccept field of the receiver
        }

        fetch(
            "http://localhost:3001/pending",  //fetches the data into the pending endpoint
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(toAccept)
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("failed"); }
                else { 
                    alert('Added to pending!');

                }})
    }

    getUserRequest(){
        if(this.state.currentEmail !== this.state.userEmail){ //this will prevent a user sending a friend request to itself
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
                        const len= body.people.length
                        
                        for(let i=len-1 ; i>=0 ; i--){
                            if(body.people[i].email === this.state.currentEmail){
                                this.setState({requestSender:body.people[i].requests,friendsList:body.people[i].friends})       //this gets the friend request and friendlist array of the current loggedin user                      
                            }
                        }
                        console.log(this.state.requestSender)
                        const lenReq = this.state.requestSender.length
                        const holder=[]
                        for(let j=lenReq-1 ; j>=0 ; j--){
                            if(this.state.userId=== this.state.requestSender[j]){  //this checks if the id of the receiver is already in the requests array of friend req sender
                                this.setState({requestSent:true})                  //this will later prevent the current logged user to send a friend request to the current viewed profile

                            }
                            holder.push(this.state.requestSender[j])     //copies the elements of the array requests of the current logged in user
                            
                            
                        }

                        const lenFr=this.state.friendsList.length
                        console.log("frcount"+lenFr)

                        for(let k=0 ; k<lenFr;k++){
                            if(this.state.userId=== this.state.friendsList[k] ){   //checks if the current logged in user is already friends with the user it is trying to add as a friend
                                this.setState({friend:true})   //this will prevent the current loggedin user in adding the current viewed user
                               
                            }
                        }
                       
                        if(!this.state.friend){     //if the current logged in user is not a friend othe current viewed and also haven't sent a request to it 
                            if(!this.state.requestSent){      //then
                                holder.push(this.state.userId) //adds the id of the currently viewed user into the request list holder of the current loggedin user
                                console.log(holder)
                                this.addFriend(holder)         //passes the holder as a paremeter to addFriend
                                this.friendtoAccept(this.state.toAccept) //passes the this.state.Accept state as a pameter to friendtoAccept function
                            }else{
                                alert("You've already sent a request")
                            }
                        }else{
                            alert("You're already friends with this account!")
                        }
                        
                    }
                })
            }else{
                alert("You can't add yourself")
            }



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

          this.vieW() //calls the vieW function
      }
    
    render(){
        if(!this.state.checkedIfLoggedIn){
            return (<div></div>)
        }else{
            if(this.state.isLoggedIn){    
            
                if(!this.state.goBack){
                    return(
                        <div className="viewPerson">
                            <div className="deetsCont">
                                <fieldset id="fhover1"> User ID: {this.state.userId}</fieldset> <br/> <fieldset id="fhover2"> Email: {this.state.userEmail}</fieldset> <br /> <fieldset id="fhover3"> Full Name: {this.state.firstname} {this.state.lastname}</fieldset>
                            </div>
                        
                            <button onClick={this.goHome}> Home</button>

                         
                            <button onClick={this.getUserRequest}> Send Friend Request</button>
                        </div>
                    )
                }else{
                    return <Navigate to="/dashboard" />
                }
            }else{
                return <Navigate to="/login"/>
            }    
        }    
    }
}