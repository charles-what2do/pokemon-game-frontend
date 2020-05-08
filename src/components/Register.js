import React, { useState } from "react";
import { registerUser } from "../utils/Common";
import "./Register.css";

function Register(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput("");
  const password = useFormInput("");
  const repeatPassword = useFormInput("");
  const [error, setError] = useState(null);
  const [hasRegistered, setRegistered] = useState(false);

  const errHandler = (error) => {
    setLoading(false);
    setError(error);
  };

  const registerHandler = () => {
    setLoading(false);
    setRegistered(true);
  };

  const handleValidation = () => {
    let formIsValid = true;
    let errorMessage = "";

    if (!username.value) {
      formIsValid = false;
      errorMessage = "Username cannot be empty";
    }

    if (typeof username.value !== "undefined") {
      if (!username.value.match(/^[a-zA-Z0-9]+$/)) {
        formIsValid = false;
        errorMessage +=
          (errorMessage !== "" ? "/n" : "") +
          "Only alphanumeric string (no spaces) for username";
      }
    }

    if (!password.value) {
      formIsValid = false;
      errorMessage +=
        (errorMessage !== "" ? "/n" : "") + "Password cannot be empty";
    }

    if (!repeatPassword.value) {
      formIsValid = false;
      errorMessage +=
        (errorMessage !== "" ? "/n" : "") + "Repeat password cannot be empty";
    }

    if (
      typeof password.value !== "undefined" &&
      typeof repeatPassword.value !== "undefined"
    ) {
      if (password.value !== repeatPassword.value) {
        formIsValid = false;
        errorMessage +=
          (errorMessage !== "" ? "/n" : "") +
          "Repeat password does not match password";
      }
    }

    console.log(errorMessage);

    setError(errorMessage);
    return formIsValid;
  };

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    if (handleValidation()) {
      const user = { username: username.value, password: password.value };
      await registerUser(user, registerHandler, errHandler);
    }
    setLoading(false);
  };

  const gotoLogin = () => {
    props.history.push("./login");
  };

  const showRegistration = () => {
    return (
      <div className="register-form">
        <div className="username">
          <h3>Username</h3>
          <input type="text" {...username} />
        </div>
        <div className="password">
          <h3>Password</h3>
          <input type="password" {...password} />
        </div>
        <div className="repeat-password">
          <h3>Repeat Password</h3>
          <input type="password" {...repeatPassword} />
        </div>
        {error && (
          <>
            <small style={{ color: "red" }}>{error}</small>
            <br />
          </>
        )}
        <br />
        <button
          onClick={async () => {
            await handleRegister();
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <br />
      </div>
    );
  };

  const showRegistrationSuccess = () => {
    return (
      <div className="register-success">
        <div className="username">
          <h3>{username.value} registered successfully</h3>
        </div>
        {error && (
          <>
            <small style={{ color: "red" }}>{error}</small>
            <br />
          </>
        )}
        <br />
        <button onClick={gotoLogin}>Login</button>
        <br />
      </div>
    );
  };

  return (
    <div className="register">
      <h1>Register</h1>
      {hasRegistered ? showRegistrationSuccess() : showRegistration()}
    </div>
  );
}

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default Register;
