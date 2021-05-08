import React from "react";
import firebase from "../../firebase/firebase";
import md5 from "md5";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const usersRef = firebase.database().ref("users");

  const { email, password, passwordConfirmation, username } = state;

  const isFormValid = () => {
    let error;

    if (isFormEmpty(state)) {
      error = { message: "Fill in all fields" };
      setErrors((prev) => [...prev, error]);
      return false;
    } else if (!isPasswordValid(state)) {
      error = { message: "Password is invalid" };
      setErrors((prev) => [...prev, error]);
      return false;
    } else {
      return true;
    }
  };

  const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  const displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  const handleChange = (event) => {
    setState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormValid()) {
      // setState({ errors: [], loading: true });
      setErrors([]);
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                console.log("user saved");
                setLoading(false);
              });
            })
            .catch((err) => {
              console.error(err);
              setLoading(false);
              setErrors((prev) => [...prev, err]);
            });
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setErrors((prev) => [...prev, err]);
        });
    }
  };

  const saveUser = (createdUser) => {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  const handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };

  const formView = () => (
    <Form onSubmit={handleSubmit} size="large">
      <Segment stacked>
        <Form.Input
          fluid
          name="username"
          icon="user"
          iconPosition="left"
          placeholder="Username"
          onChange={handleChange}
          value={username}
          type="text"
        />

        <Form.Input
          fluid
          name="email"
          icon="mail"
          iconPosition="left"
          placeholder="Email Address"
          onChange={handleChange}
          value={email}
          className={handleInputError(errors, "email")}
          type="email"
        />

        <Form.Input
          fluid
          name="password"
          icon="lock"
          iconPosition="left"
          placeholder="Password"
          onChange={handleChange}
          value={password}
          className={handleInputError(errors, "password")}
          type="password"
        />

        <Form.Input
          fluid
          name="passwordConfirmation"
          icon="repeat"
          iconPosition="left"
          placeholder="Password Confirmation"
          onChange={handleChange}
          value={passwordConfirmation}
          className={handleInputError(errors, "password")}
          type="password"
        />

        <Button
          disabled={loading}
          className={loading ? "loading" : ""}
          color="orange"
          fluid
          size="large"
        >
          Submit
        </Button>
      </Segment>
    </Form>
  );

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>

        {formView()}

        {errors?.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(errors)}
          </Message>
        )}
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
