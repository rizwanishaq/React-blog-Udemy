const authReducer = (draft, action) => {
  switch (action.type) {
    case "login":
      draft.loggedIn = true;
      draft.user = action.payload;
      return;
    case "logout":
      draft.loggedIn = false;
      draft.user = {
        token: "",
        username: "",
        avatar: "",
      };
      return;
    case "flashMessage":
      draft.flashMessages.push(action.payload);
      return;
    case "openSearch":
      draft.isSearchOpen = true;
      return;
    case "closeSearch":
      draft.isSearchOpen = false;
      return;
    case "toggleChat":
      draft.isChatOpen = !draft.isChatOpen;
      return;
    case "closeChat":
      draft.isChatOpen = false;
      return;
    case "incrementUnreadChatCount":
      draft.unreadChatCount++;
      return;
    case "clearUnreadChatCount":
      draft.unreadChatCount = 0;
      return;
    default:
      return;
  }
};

export default authReducer;
