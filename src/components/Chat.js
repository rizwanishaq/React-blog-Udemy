import React, { useContext, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import AuthContext from "../context/auth/authContext";

const socket = io("http://localhost:8000");

const Chat = () => {
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const {
    isChatOpen,
    closeChat,
    user,
    incrementUnreadChatCount,
    clearUnreadChatCount,
  } = useContext(AuthContext);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    if (isChatOpen) {
      chatField.current.focus();
      clearUnreadChatCount();
    }
    // eslint-disable-next-line
  }, [isChatOpen]);

  useEffect(() => {
    socket.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessages.length && !isChatOpen) {
      incrementUnreadChatCount();
    }
    // eslint-disable-next-line
  }, [state.chatMessages]);

  const handleFieldChange = (e) => {
    const value = e.target.value;
    setState((draft) => {
      draft.fieldValue = value;
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send message to chat server
    socket.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: user.token,
    });

    setState((draft) => {
      // Add message to state collection of messages
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: user.username,
        avatar: user.avatar,
      });
      draft.fieldValue = "";
    });
  };

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (isChatOpen ? "chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => closeChat()} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username === user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img
                  className="chat-avatar avatar-tiny"
                  src={message.avatar}
                  alt={message.avatar}
                />
              </div>
            );
          } else {
            return (
              <div key={index} className="chat-other">
                <Link to={`/profile/${message.username}`}>
                  <img
                    className="avatar-tiny"
                    src={message.avatar}
                    alt={message.avatar}
                  />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <Link to={`/profile/${message.username}`}>
                      <strong>{message.username}: </strong>
                    </Link>
                    {message.message}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          value={state.fieldValue}
          onChange={handleFieldChange}
          ref={chatField}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Chat;
