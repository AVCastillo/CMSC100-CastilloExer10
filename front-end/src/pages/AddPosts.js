import React from 'react';
import "./design.css"


class AddPosts extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            Email:props.data,
            fullName:''
        }

        this.post=this.post.bind(this)
    }

    post(){              //this will fetch the author_reference, full name of the author and the content into the add-post endpoint
        const add={
            author:this.state.Email,
            fullname:this.state.fullName,
            content:document.getElementById('tArea').value
  
        }

        fetch(
            "http://localhost:3001/add-post",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(add)
             
            })

            .then(response => response.json())
            .then(body => {
                if (!body.success) { alert("Failed to add post"); }
                else { 
                    alert('Posted!');

                }})

    }
    
    componentDidMount(){  //this will get the full name of the author

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
                        if(body.people[i].email === this.state.Email){
                           this.setState({fullName:body.people[i].firstName.concat(" ",body.people[i].lastName)})
                            
                        }
                    }
                }})
    }
    
    
    
    render(){
        
 
        return(
            <div className='addPostCont'>
                <div id="postForm" >
                    <form >
                        
                        <textarea id='tArea' rows="4" cols='58' placeholder='Say something...' ></textarea> <br />
                        <button onClick={this.post}> Post </button>
                    </form>
                </div>
            </div>    




        )
    }
}

export default AddPosts