import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";

import AuthContext from "./authContext";
import authReducer from "./authReducer";

const AuthState = (props) => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
    isSearchOpen: false,
  };

  const [state, dispatch] = useImmerReducer(authReducer, initialState);

  const logout = () => {
    dispatch({ type: "logout" });
  };

  const login = (data) => {
    dispatch({ type: "login", payload: data });
  };

  const flashMessage = (msg) => {
    dispatch({ type: "flashMessage", payload: msg });
  };

  const openSearch = () => {
    dispatch({ type: "openSearch" });
  };

  const closeSearch = () => {
    dispatch({ type: "closeSearch" });
  };

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
      localStorage.removeItem("complexappAvatar");
    }
    // eslint-disable-next-line
  }, [state.loggedIn]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loggedIn: state.loggedIn,
        login,
        logout,
        flashMessage,
        messages: state.flashMessages,
        isSearchOpen: state.isSearchOpen,
        openSearch,
        closeSearch,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
