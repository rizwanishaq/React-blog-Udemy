import React, { useEffect, useContext } from "react";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import axios from "axios";
import { useImmer } from "use-immer";

import Page from "./Page";
import AuthContext from "../context/auth/authContext";
import ProfilePosts from "./ProfilePosts";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";

const Profile = () => {
  const { username } = useParams();
  const { user, loggedIn } = useContext(AuthContext);

  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
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
        setState((draft) => {
          draft.profileData = response.data;
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    return () => {
      ourRequest.cancel();
    };
    // eslint-disable-next-line
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = axios.CancelToken.source();

      const fetchData = async () => {
        try {
          await axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }

    // eslint-disable-next-line
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = axios.CancelToken.source();

      const fetchData = async () => {
        try {
          await axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }

    // eslint-disable-next-line
  }, [state.stopFollowingRequestCount]);

  const startFollowing = () => {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  };

  const stopFollowing = () => {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  };

  return (
    <Page title="Profile screen">
      <h2>
        <img
          className="avatar-small"
          src={state.profileData.profileAvatar}
          alt=""
        />{" "}
        {state.profileData.profileUsername}
        {loggedIn &&
          !state.profileData.isFollowing &&
          user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== "..." && (
            <button
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {loggedIn &&
          state.profileData.isFollowing &&
          user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink
          exact
          to={`/profile/${state.profileData.profileUsername}`}
          className="nav-item nav-link"
        >
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/followers`}
          className="nav-item nav-link"
        >
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/following`}
          className="nav-item nav-link"
        >
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollowers />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollowing />
        </Route>
      </Switch>
    </Page>
  );
};

export default Profile;
