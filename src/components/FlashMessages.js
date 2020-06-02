import React, { useContext } from "react";
import AuthContext from "../context/auth/authContext";

const FlashMessages = (props) => {
  const { messages } = useContext(AuthContext);
  return (
    <div className="floating-alerts">
      {messages.map((msg, index) => {
        return (
          <div
            key={index}
            className="alert alert-success text-center floating-alert shadow-sm"
          >
            {msg}
          </div>
        );
      })}
    </div>
  );
};

export default FlashMessages;
