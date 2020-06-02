import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Page from "./Page";
import AuthContext from "../context/auth/authContext";
import ProfilePosts from "./ProfilePosts";

const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" },
  });

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `/profile/${username}`,
          {
            token: user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        setProfileData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    return () => {
      ourRequest.cancel();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Page title="Profile screen">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} alt="" />{" "}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
};

export default Profile;
