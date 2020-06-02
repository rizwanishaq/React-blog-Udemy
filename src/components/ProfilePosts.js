import React, { useState, useEffect } from "react";
import axios from "axios";
import Moment from "react-moment";

import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token,
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
    // eslint-disable-next-line
  }, []);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        return (
          <Link
            key={post._id}
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
              on <Moment format="YYYY-MM-DD HH:mm">{post.createdDate}</Moment>
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProfilePosts;
