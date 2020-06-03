import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import AuthContext from "../context/auth/authContext";
import axios from "axios";
import Moment from "react-moment";
import { Link } from "react-router-dom";

const Search = () => {
  const { isSearchOpen, closeSearch } = useContext(AuthContext);
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);

    return () => document.removeEventListener("keyup", searchKeyPressHandler);
    // eslint-disable-next-line
  }, []);

  const searchKeyPressHandler = (e) => {
    if (e.keyCode === 27) {
      closeSearch();
    }
  };

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 750);

      return () => {
        clearTimeout(delay);
      };
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }

    // eslint-disable-next-line
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      // Send axios request here
      const ourRequest = axios.CancelToken.source();

      const fetchResults = async () => {
        try {
          const response = await axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { cancelToken: ourRequest.token }
          );

          setState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);

  const handleInput = (e) => {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  };

  if (!isSearchOpen) return "";
  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            onChange={handleInput}
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
          />
          <span onClick={() => closeSearch()} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show === "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show === "results" ? "live-search-results--visible" : "")
            }
          >
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length}{" "}
                  {state.results.length > 1 ? "items " : "item "}
                  found)
                </div>
                {state.results.map((post) => {
                  return (
                    <Link
                      onClick={() => closeSearch()}
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
                        {" "}
                        by {post.author.username} on{" "}
                        <Moment format="YYYY-MM-DD HH:mm">
                          {post.createdDate}
                        </Moment>
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
            {!Boolean(state.results.length) && (
              <p className="alert alert-danger text-center shadow-sm">
                Sorry we could not find any results for that search.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
