import React, { useState, useEffect } from "react";
import axios from "axios";

import { useParams } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

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
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        return <Post post={post} key={post._id} noAuthor={true} />;
      })}
    </div>
  );
};

export default ProfilePosts;
