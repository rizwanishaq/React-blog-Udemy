import React, { useState, useEffect } from "react";
import axios from "axios";

import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

const ProfileFollowers = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/profile/${username}/followers`, {
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
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action"
          >
            <img
              className="avatar-tiny"
              src={follower.avatar}
              alt={follower.avatar}
            />
            {follower.username}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollowers;
