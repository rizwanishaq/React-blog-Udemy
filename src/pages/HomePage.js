import React, { useContext } from "react";
import AuthContext from "../context/auth/authContext";
import Home from "../components/Home";
import HomeGuest from "../components//HomeGuest";

const HomePage = () => {
  const { loggedIn } = useContext(AuthContext);

  return <>{loggedIn ? <Home /> : <HomeGuest />}</>;
};

export default HomePage;
