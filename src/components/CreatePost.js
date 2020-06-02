import React, { useState, useContext } from "react";
import Page from "./Page";
import axios from "axios";
import { withRouter } from "react-router-dom";
import AuthContext from "../context/auth/authContext";

const CreatePost = (props) => {
  const { flashMessage, user } = useContext(AuthContext);

  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/create-post", {
        title,
        body,
        token: user.token,
      });
      flashMessage("Congrts, you successfully created a page");
      // Redirect to new post url
      props.history.push(`/post/${response.data}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};

export default withRouter(CreatePost);
