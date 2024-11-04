import React from "react"
import { Navigate } from "react-router-dom";
// const queryString=require('query-string')

class DisplayPosts extends React.Component{
        constructor(props){
            super(props)
            this.state={
                email:props.data,
                posts:[],
                objPosts:[],
                key:0,
                goEdit:false
            }

            this.getKey=this.getKey.bind(this)
            this.delete=this.delete.bind(this)
        }

    
      
    getKey(e){           //this will get the key of the post to be edited then will redirect the page into the edit page
       const pid=this.state.objPosts[e].id
       console.log(pid)
       this.setState({goEdit:true})
       localStorage.setItem("id",pid)
    }  
    
    delete(e){                       // this will fetch the id of the post to be deleted  into the delete-post endpoint which will delete the post

        const deletePost={
            id:this.state.objPosts[e].id
           
  
        }

        fetch(
            "http://localhost:3001/delete-post",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(deletePost)
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("Failed to delete post"); }
                else {
                    alert('Deleted!');
                    window.location.reload(true)
                    
                   

                }})





    }

    componentDidMount(){    //this will get all posts of the current loggedin user 

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
                    // this.setState({posts:body.post})
                    const arr=[]
                    const arr2=[]
                    const len=body.post.length

                    for (let i=len-1; i>=0; i--){
                        if(body.post[i].author_reference === this.state.email){
                            arr.push({author:body.post[i].fullName,content:body.post[i].content, timestamp:body.post[i].timestamp})
                            arr2.push({id:body.post[i]._id, author:body.post[i].author_reference})
                        }
                    }
                    this.setState({posts:arr})
                    this.setState({objPosts:arr2})
                    
                    console.log(arr.length)


                }})
    
            }
    

    
    render(){
        if(!this.state.goEdit){
            return(
                <div className="displayPostsCont">
                    <div className="displayPosts">
                        
                            {
                                this.state.posts.map((post,index)=>{
                                    return <li key={index}> <fieldset> {post.author}<br /> <br />{post.content} <br /><br />{post.timestamp} <br /><button onClick={this.getKey.bind(this,index)}> edit</button> <button onClick={this.delete.bind(this,index)}> delete</button>  </fieldset></li>
                                } )
                            }
                    
                        
                        
                    </div>
                </div>    
            )
        }else{
            return <Navigate to="/edit"/>
        }
    }
}

export default DisplayPosts