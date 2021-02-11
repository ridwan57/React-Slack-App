import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
	apiKey: 'AIzaSyAAWm5ee0i_fuuiAWzocb7ZPZMfICSs8CQ',
	authDomain: 'react-slack-clone-5f6a4.firebaseapp.com',
	projectId: 'react-slack-clone-5f6a4',
	storageBucket: 'react-slack-clone-5f6a4.appspot.com',
	messagingSenderId: '662674829237',
	appId: '1:662674829237:web:d1ec204e9cb81955ff33fc',
	measurementId: 'G-0PBJNP6HVE',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
