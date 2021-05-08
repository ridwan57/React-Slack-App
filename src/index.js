import reportWebVitals from "./reportWebVitals";

import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./component/App";
import "./index.css";
import { Route, Switch, useHistory } from "react-router-dom";
import Login from "./component/Auth/Login";
import Register from "./component/Auth/Register";
import firebase from "./firebase/firebase";
import "semantic-ui-css/semantic.min.css";

import { useSelector, useDispatch } from "react-redux";

import { setUser, clearUser } from "./actions/index";
import Spinner from "./Spinner";
import { MyProvider } from "./store/store";

const Root = () => {
  const { isLoading } = useSelector((state) => ({ ...state.user }));
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log(user);
        dispatch(setUser(user));
        history.push("/");
      } else {
        history.push("/login");
        dispatch(clearUser());
      }
    });
  }, [dispatch, history]);
	
  if (isLoading) return <Spinner />;

  return (
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

// ReactDOM.render(
//   <Provider store={store}>
//     <Router>
//       <Root />
//     </Router>
//   </Provider>,
//   document.getElementById("root")
// );

ReactDOM.render(
  <MyProvider>
    <Root />
  </MyProvider>,
  document.getElementById("root")
);
reportWebVitals();
