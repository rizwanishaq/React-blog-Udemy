import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const Post = ({ post, onClick, noAuthor }) => {
  return (
    <Link
      onClick={onClick}
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
    >
      <img
        className="avatar-tiny"
        src={post.author.avatar}
        alt={post.author.avatar}
      />{" "}
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {" "}
        {!noAuthor && <>by {post.author.username}</>} on{" "}
        <Moment format="YYYY-MM-DD HH:mm">{post.createdDate}</Moment>
      </span>
    </Link>
  );
};

export default Post;
