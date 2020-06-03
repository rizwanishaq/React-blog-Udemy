import React, { useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import { useParams, Link, withRouter } from "react-router-dom";
import axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import AuthContext from "../context/auth/authContext";
import NotFound from "./NotFound";

const EditPost = (props) => {
  const { flashMessage, user } = useContext(AuthContext);
  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };
  const editReducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.payload.title;
        draft.body.value = action.payload.body;
        draft.isFetching = false;
        return;
      case "titleChange":
        draft.title.value = action.payload;
        draft.title.hasErrors = false;
        return;
      case "bodyChange":
        draft.body.value = action.payload;
        draft.body.hasErrors = false;
        return;
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasError) {
          draft.sendCount++;
        }

        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.payload.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title";
        }
        return;
      case "bodyRules":
        if (!action.payload.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide body contents";
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
      default:
        return;
    }
  };
  const [state, dispatch] = useImmerReducer(editReducer, originalState);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "titleRules", payload: state.title.value });
    dispatch({ type: "bodyRules", payload: state.body.value });
    dispatch({
      type: "submitRequest",
    });
  };

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token,
        });
        if (response.data) {
          dispatch({ type: "fetchComplete", payload: response.data });
          if (user.username !== response.data.author.username) {
            flashMessage("You donot have permission to update the post");
            // redirect to homepage
            props.history.push("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = axios.CancelToken.source();
      const fetchPost = async () => {
        try {
          await axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          dispatch({ type: "saveRequestFinished" });
          flashMessage("Post was updated");
        } catch (err) {
          console.log(err);
        }
      };
      fetchPost();
      return () => {
        ourRequest.cancel();
      };
    }

    // eslint-disable-next-line
  }, [state.sendCount]);

  if (state.notFound) return <NotFound />;

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to post permalink
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            value={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={(e) =>
              dispatch({ type: "titleChange", payload: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "titleRules", payload: e.target.value })
            }
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
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
            value={state.body.value}
            onChange={(e) =>
              dispatch({ type: "bodyChange", payload: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "bodyRules", payload: e.target.value })
            }
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Update
        </button>
      </form>
    </Page>
  );
};

export default withRouter(EditPost);
