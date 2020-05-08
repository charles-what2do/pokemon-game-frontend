import React, { useState } from "react";
import "./Login.css";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput("");
  const password = useFormInput("");
  const [error, setError] = useState(null);

  const loginHandler = () => {
    props.setLoggedIn(true);
    props.history.push("/start");
  };

  const errHandler = (error) => {
    setError(error);
    setLoading(false);
  };

  const handleLogin = () => {
    setError(null);
    setLoading(true);
    if (handleValidation()) {
      const user = { username: username.value, password: password.value };
      props.login(user, loginHandler, errHandler);
    }
    setLoading(false);
  };

  const handleValidation = () => {
    let formIsValid = true;
    let errorMessage = "";

    if (!username.value) {
      formIsValid = false;
      errorMessage = "Username cannot be empty";
    }

    if (!password.value) {
      formIsValid = false;
      errorMessage +=
        (errorMessage !== "" ? "/n" : "") + "Password cannot be empty";
    }

    setError(errorMessage);
    return formIsValid;
  };

  const gotoRegister = () => {
    props.history.push("./register");
  };

  return (
    <div>
      <h1>Login</h1>
      <div className="username">
        <h3>Username</h3>
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div className="password">
        <h3>Password</h3>
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && (
        <>
          <small style={{ color: "red" }}>{error}</small>
          <br />
        </>
      )}
      <br />
      <button onClick={gotoRegister} disabled={loading}>
        Register
      </button>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
      <br />
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

export default Login;
