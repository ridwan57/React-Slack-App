import React from 'react';
import ReactDOM from 'react-dom';
import App from './component/App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import firebase from './firebase/firebase'
import 'semantic-ui-css/semantic.min.css';
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from './reducers/index';
import { setUser, clearUser } from './actions/index'
import Spinner from './Spinner';
const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {


	componentDidMount() {
		console.log(this.props.isLoading)
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				// console.log(user);
				this.props.setUser(user);
				this.props.history.push("/");
			} else {
				this.props.history.push("/login");
				this.props.clearUser();
			}
		});
	}

	render() {
		return this.props.isLoading ? <Spinner /> : (
			<Router >
				<Switch>
					<Route exact path="/" component={App} ></Route>
					<Route exact path="/login" component={Login}></Route>
					<Route exact path="/register" component={Register}></Route>

				</Switch>
			</Router>
		)
	}
}
const mapStateFromProps = state => ({
	isLoading: state.user.isLoading
})
const RootWithAuth = withRouter(connect(
	mapStateFromProps, { setUser, clearUser })(Root))

ReactDOM.render(
	<Provider store={store}>
		<Router >
			<RootWithAuth />
		</Router>

	</Provider>

	, document.getElementById('root'));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
