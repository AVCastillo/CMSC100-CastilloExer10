import React from "react";
import "./design.css"

export default class MyFriends extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            id: props.data,
            friends:[],
            friendsEmail:[],
            friendsPosts:[],
            fullName:''
        }
        this.getFriendEmails=this.getFriendEmails.bind(this)
        this.getPostsFriends=this.getPostsFriends.bind(this)
        this.printFrPosts=this.printFrPosts.bind(this)
       
    }


    
    getPostsFriends(email){
        fetch(
            "http://localhost:3001/display-post",
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
                    const len=body.post.length
                    
                    const eLen=email.length
                    for(let j=0 ; j<eLen;j++){
                        for (let i=len-1; i>=0; i--){
                            if(body.post[i].author_reference === email[j]){
                               
                                arr.push( {author:body.post[i].fullName, content:body.post[i].content, timestamp:body.post[i].timestamp})
                                
                            }
                        }
                    }
                    console.log(arr)
                    this.setState({friendsPosts:arr})
                    console.log(this.state.friendsPosts)
                    


                }})



    }

    getFriendEmails(){
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
                    const frLen=this.state.friends.length
                    const emailHolder=[]
                    for(let j=0; j<frLen;j++){
                        for (let i=len-1; i>=0; i--){
                            if(body.people[i]._id === this.state.friends[j]){
                            
                                emailHolder.push(body.people[i].email)
                            }
                        }
                    }
                    console.log(emailHolder)
                    this.getPostsFriends(emailHolder)
                }})
    }
    
    
    componentDidMount(){
        const friends={
            id:this.state.id
  
        }
        
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
                    console.log(body.friends.length)
                    
                    

                    for (let i=len-1; i>=0; i--){
                        
                        arr.push(body.friends[i])
    
                        }
                    this.setState({friends:arr})    
                    console.log(this.state.friends)
                }})
            this.printFrPosts()
           
            


    }
    
    printFrPosts(){
        console.log(this.state.friendsPosts)
        this.getFriendEmails()
    }
    
    
    
    
    render(){
        return(
            <div className="friendPostCont">
                <div className="friendPost">
                    <br/>

                    {
                        this.state.friendsPosts.map((post,index)=>{
                            return <li key={index}><fieldset>Friend: {post.author}<br /><br /> {post.content}<br /><br />{post.timestamp}</fieldset></li>
                        })


                    }    
                </div>
            </div>    
        )

    }
}