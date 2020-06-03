import React, { useState, useEffect, useContext } from "react";
import Page from "./Page";
import { useParams, Link, withRouter } from "react-router-dom";
import axios from "axios";
import Moment from "react-moment";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import AuthContext from "../context/auth/authContext";

const ViewSinglePost = (props) => {
  const { user, loggedIn, flashMessage } = useContext(AuthContext);

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
    // eslint-disable-next-line
  }, [id]);

  const isOwner = () => {
    if (loggedIn) {
      return user.username === post.author.username;
    }
    return false;
  };

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  const deleteHandler = async () => {
    const areYourSure = window.confirm(
      "Do you really want to delete this post"
    );
    if (areYourSure) {
      try {
        const response = await axios.delete(`/post/${id}`, {
          data: { token: user.token },
        });
        if (response.data === "Success") {
          flashMessage("Post was successfully  deleted");
          props.history.push(`/profile/${user.username}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>

        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
              onClick={deleteHandler}
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img
            className="avatar-tiny"
            src={post.author.avatar}
            alt={post.author.avatar}
          />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on <Moment format="YYYY-MM-DD HH:mm">{post.createdDate}</Moment>
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  );
};

export default withRouter(ViewSinglePost);
