import reportWebVitals from "./reportWebVitals";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import App from "./component/App";
import "./index.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import Login from "./component/Auth/Login";
import Register from "./component/Auth/Register";
import firebase from "./firebase/firebase";
import "semantic-ui-css/semantic.min.css";
import { createStore } from "redux";
import { Provider, connect, useSelector, useDispatch } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers/index";
import { setUser, clearUser } from "./actions/index";
import Spinner from "./Spinner";
const store = createStore(rootReducer, composeWithDevTools());

const Root = () => {
  const { isLoading } = useSelector((state) => ({ ...state.user }));
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log(user);
        dispatch(setUser(user));
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        dispatch(clearUser());
      }
    });
  }, []);

  return isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

// const mapStateFromProps = state => ({
// 	isLoading: state.user.isLoading
// });

// const RootWithAuth = withRouter(
// 	connect(
// 		mapStateFromProps,
// 		{ setUser, clearUser }
// 	)(Root)
// );

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Root />
    </Router>
  </Provider>,
  document.getElementById("root")
);
reportWebVitals();
