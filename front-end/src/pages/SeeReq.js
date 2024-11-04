import React from "react";
import "./design.css"


export default class SeeReq extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            loggedinId: props.data,
            pendingReqs:[],
            pendingReqsNames:[],
            friends:[],
            friendOther:[],
            updateReq:[],
            otherUpdateReq:[]

        }
        this.see=this.see.bind(this)
        this.getFriends=this.getFriends.bind(this)
        this.acceptFR=this.acceptFR.bind(this)
        this.getRequests=this.getRequests.bind(this)
        this.mutualFriend=this.mutualFriend.bind(this)
        this.getReqToUpdate=this.getReqToUpdate.bind(this)
        this.getOtherReqToUp=this.getOtherReqToUp.bind(this)
      
 
        
    }
    see(){
        
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
                        if(body.people[i]._id === this.state.loggedinId){
                            this.setState({pendingReqs:body.people[i].toAccept})
                            
                        }
                    }
                    console.log(this.state.pendingReqs)

                    const lenPending=this.state.pendingReqs.length
                    const revPending=[]
                    for(let j=lenPending-1; j>=0;j--){
                        revPending.push(this.state.pendingReqs[j])
                    }

                    const namePending=[]
                    for(let k=0; k<lenPending;k++){
                        for(let l=0; l<len; l++){
                            if(body.people[l]._id === revPending[k] ){
                                namePending.push(body.people[l].firstName.concat(" ",body.people[l].lastName))
                            }
                        }
                    }

                  
                    console.log(namePending)
                    this.setState({pendingReqsNames:namePending})
                    
                   
                    
                }
            })
    }

    getFriends(){  //gets the friends list of the current loggein user
      
        const friends={
            id:this.state.loggedinId
  
        }
        console.log(friends.id)
        fetch(
            "http://localhost:3001/viewFriends",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(friends) 
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("there are no friends"); }
                else { 
                    // this.setState({posts:body.post})
                    const arr=[]
                    const len=body.friends.length
                    console.log(body.friends)
                    
                    

                    for (let i=len-1; i>=0; i--){
                        
                        arr.push(body.friends[i])
    
                        }
                    this.setState({friends:arr})
                    console.log(arr)
                    console.log(this.state.friends)    
                    

                }})
    }


    componentDidMount(){
        this.getFriends()
    }
    
    acceptFR(index){
       //lines 132-144 will just add the id of the accepted user from the pendingReqs into the friendsList of the current logged in user
       console.log(accepted)
        const accepted= this.state.pendingReqs[index]   
        
        const friendHolder=[]
        const len= this.state.friends.length
        console.log(len)
        
            for (let i=0;i<len;i++){
                friendHolder.push(this.state.friends[i])
            }
        
        friendHolder.push(accepted)
        console.log(friendHolder)

        //linew 147-154 will just remove the id of the accepted user from the pending reqs array of the current loggedin user
        const still=[]
        const num= this.state.pendingReqs.length
        for(let j=0;j<num;j++){
            still.push(this.state.pendingReqs[j])
        }

        still.splice(index,1)
        console.log(still)
        
        const update={        //this will be the paramters for the accept-friend request body
            id:this.state.loggedinId,
            accepted:friendHolder,
            stillpending:still
        }
        this.getFriendsOther(accepted,this.state.loggedinId)
        this.getRequests(accepted)
       

        fetch(
            "http://localhost:3001/accept-friend",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(update)
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("failed"); }
                else {
                    
                    alert('Accepted Friend  Request!');


                }})
        window.location.reload(false)        



    }

    getRequests(id){  //this will just remove the id of the current loggedin  user from the request array of the accepted friend request sender
        
        const reqs={
            id:id
        }
        
        fetch(
            "http://localhost:3001/get-requests",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(reqs)
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("failed"); }
                else { 
                    const reqLen= body.reqs.length
                    console.log(reqLen)
                    const req=[]
                    for(let i=reqLen-1; i>=0;i--){
                        req.push(body.reqs[i])
                    }
                    console.log(req)
                    const ind=this.state.loggedinId
                    const toremove=req.indexOf(ind)
                    req.splice(toremove,1)
                    console.log(req)
                    this.mutualFriend(id,req)

                }})
    }


    getFriendsOther(id,currentID){ //this will get the list of friends of the accepted request sender and adds the id of acceptor to its array of friends
      
        const friends={
            id:id
  
        }
        console.log(id)
        console.log(currentID)
        fetch(
            "http://localhost:3001/viewFriends",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(friends) 
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("there are no friends"); }
                else { 
                    // this.setState({posts:body.post})
                    const arrOther=[]
                    const len=body.friends.length
                    console.log(body.friends)
                    
                    

                    for (let i=len-1; i>=0; i--){
                        
                        arrOther.push(body.friends[i])
    
                        }
                    arrOther.push(currentID)    
                    this.setState({friendOther:arrOther})
                    console.log()
                    console.log(this.state.friendOther)    
                    

                }})
    }

    mutualFriend(id,req){ //this will just fetch the necessary data to make the receiver a friend of the sender
        const mutual={
            id:id,
            mutual:this.state.friendOther,
            acceptedreq:req
        }

        fetch(
            "http://localhost:3001/mutual-friend",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(mutual)
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("failed"); }
                else { 
                    alert('Accepted Friend  Request!');

                }})

    }
    
    
    getReqToUpdate(index){ //this will just remove the selected request sender id from the pending to accept of the current loggedin user
       
    
        const still=[]
        const num= this.state.pendingReqs.length
        for(let j=0;j<num;j++){
            still.push(this.state.pendingReqs[j])
        }
        const tofind=still[index] //this will be used to access the id of the sender of the deleted request
        still.splice(index,1)  //removes the id at the chosen index from the array of pending toAccept friends of the current logged in user
        console.log(still)

        console.log(this.state.loggedinId)
        const todel={
            id:this.state.loggedinId,
            reqs:still
        }
        this.getOtherReqToUp(tofind)
       
       

        fetch(
            "http://localhost:3001/remove-req",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(todel)
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("failed"); }
                else {
                    
                    alert('DeletedFriend  Request!');


                }})
        window.location.reload(false)
    }

    
    getOtherReqToUp(index){ //this will just remove the id of the receiver from the requests array field of the request sender
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
                        if(body.people[i]._id === index){
                            this.setState({otherUpdateReq:body.people[i].requests})
                            console.log(this.state.otherUpdateReq)
                            const holder=[]
                            const lenReq= this.state.otherUpdateReq.length
                            console.log(lenReq)
                            for(let j=0; j<lenReq;j++){
                                holder.push(this.state.otherUpdateReq[j])
                            }
                            console.log(holder)
                            const toRemove=holder.indexOf(this.state.loggedinId)
                            console.log(this.state.loggedinId)
                            holder.splice(toRemove,1)
                            console.log(holder)
                            this.setState({otherUpdateReq:holder})
                            this.fetchRemoveReqOther(index,holder)

                            
                        }
                    }
                }})

            
    }


    fetchRemoveReqOther(id,req){
        const todel={
            id:id,
            reqs:req
        }

        fetch(
                "http://localhost:3001/remove-req-other",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todel)
                
                })

                .then(response => response.json())
                .then(body => {
                    if (!body.success) { console.log("failed to removed") }
                    else {
                        
                        console.log("removed request from the sender side");


                    }})


    }
    
   
    

    
    
    render(){
        return(
            <div className="reqs">
                <button onClick={this.see}> Friend requests</button>
                
                <br/>
                <br/>

                {
                    this.state.pendingReqsNames.map((namE,index)=>{
                        return <li key={index}><fieldset>{namE}  <button className="accept-button-req" onClick={this.acceptFR.bind(this,index)}>Accept</button> <button  onClick={this.getReqToUpdate.bind(this,index)}> delete</button></fieldset></li>
                    })
                }
            </div>
        )
    }
}