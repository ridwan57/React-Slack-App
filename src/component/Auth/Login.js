import React, { useState } from "react";
import firebase from "../../firebase/firebase";
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

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    errors: [],
    loading: false,
  });
  const { email, errors, loading, password } = state;

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
    if (isFormValid(state)) {
      setState((prev) => ({
        ...prev,
        errors: [],
        loading: true,
      }));
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((signedInUser) => {
          console.log(signedInUser);
        })
        .catch((err) => {
          console.error(err);
          setState({
            errors: errors.concat(err),
            loading: false,
          });
        });
    }
  };

  const isFormValid = ({ email, password }) => email && password;

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

        <Button
          disabled={loading || errors.length > 0}
          className={loading ? "loading" : ""}
          color="violet"
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
        <Header as="h1" icon color="violet" textAlign="center">
          <Icon name="code branch" color="violet" />
          Login to DevChat
        </Header>
        {formView()}
        {errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(errors)}
          </Message>
        )}
        <Message>
          Don't have an account? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
