import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Login from "./pages/Login"
import SignIn from "./pages/SignIn"
import Edit from "./pages/EditPost"
import SearchPeople from "./pages/SearchPeople";
import ViewPerson from "./pages/ViewPerson";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact={true} path="/" element={<SignIn />}/>
          <Route exact={true} path="/login" element={<Login />} />
          <Route exact={true} path="/dashboard" element={<Feed />} />
          <Route exact={true} path="/edit" element={<Edit/>} />
          <Route  exact={true} path="/searchPeople" element={<SearchPeople />}/>
          <Route  exact={true} path="/viewPerson" element={<ViewPerson />}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
