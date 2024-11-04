import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import AddPosts from "./AddPosts";
import DisplayPosts from "./DisplayPost"
import Friends from "./MyFriends"
import Search from "./SearchPeople"
import SeeReq from "./SeeReq"
import homeLogo from "./pics/home.png"
import settings from "./pics/settings.png"


export default class Feed extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkedIfLoggedIn: false,
      isLoggedIn: null,
      email: "",
      iD: ""
    }

    this.logout = this.logout.bind(this);
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
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: true, email: localStorage.getItem("email"),iD: localStorage.getItem("loggedinID")});
        } else {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: false });
        }
      });
  }

  logout(e) {
    e.preventDefault();

    // Delete cookie with authToken
    const cookies = new Cookies();
    cookies.remove("authToken");

    // Delete username in local storage
    localStorage.removeItem("email");
    localStorage.removeItem("loggedinID");
    localStorage.removeItem("full-name")
    localStorage.removeItem("userId")

    this.setState({ isLoggedIn: false });
  }

  render() {
    if (!this.state.checkedIfLoggedIn) {
      // delay redirect/render
      return (<div></div>)
    }

    else {
      if (this.state.isLoggedIn) {
        // render the page
        return (
          <div className="wholeFeed">
            <div className="feed">
              <Search />
              <div className="logoutCont">
                <button id="logout" onClick={this.logout}>Log Out</button>
              </div>
              <a href="/dashboard"><img id="settingsLogo" src={settings} height="35px"/></a>
              <a href="/dashboard"><img id="homeLogo"src={homeLogo} height="35px"/></a>
              <SeeReq data={this.state.iD}/>
              
              <AddPosts data={this.state.email}/>
              <DisplayPosts data={this.state.email} />
              <Friends data={this.state.iD}/>
             
              
              
              
              
              <br />
              
            </div>
          </div>   
        )
      }

      else {
        // redirect
        return <Navigate to="/login" />
      }
    }
  }
}