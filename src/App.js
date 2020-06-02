import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

import AuthState from "./context/auth/authState";
import HomePage from "./pages/HomePage";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";

function App() {
  return (
    <AuthState>
      <BrowserRouter>
        <FlashMessages />
        <Header />
        <Switch>
          <Route path="/profile/:username" component={Profile} />
          <Route path="/" exact component={HomePage} />
          <Route path="/post/:id" exact component={ViewSinglePost} />
          <Route path="/post/:id/edit" component={EditPost} />
          <Route path="/create-post" component={CreatePost} />
          <Route path="/about-us" component={About} />
          <Route path="/terms" component={Terms} />
          <Route component={NotFound} />
        </Switch>
        <Search />
        <Footer />
      </BrowserRouter>
    </AuthState>
  );
}

export default App;
