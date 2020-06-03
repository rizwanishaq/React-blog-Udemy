import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import axios from "axios";
import Page from "./Page";
import AuthContext from "../context/auth/authContext";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";
const Home = () => {
  const { user } = useContext(AuthContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "/getHomeFeed",
          {
            token: user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
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
  }, []);
  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }
  return (
    <Page title="Your Feed">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">The Latest From Those you Follow</h2>
          <div className="list-group">
            {state.feed.map((post) => {
              return <Post post={post} key={post._id} />;
            })}
          </div>
        </>
      )}
      {state.feed.length === 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  );
};

export default Home;
