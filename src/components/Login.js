import React, { useState } from "react";
import axios from "axios";
// import { setUserSession } from "./Utils/Common";
const baseURL = "http://localhost:3001/user";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput("");
  const password = useFormInput("");
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios({
      method: "post",
      url: baseURL + "/login",
      data: {
        username: username.value,
        password: password.value,
      },
    })
      .then((response) => {
        setLoading(false);
        props.history.push("/start");
      })
      .catch((error) => {
        setLoading(false);
        if (!!error.response) {
          if (error.response.status === 400) {
            console.log(error.response.data);
            setError(JSON.stringify(error.response.data));
          } else {
            setError("Something went wrong. Please try again later.");
          }
        } else {
          setError("Something went wrong. Please try again later.");
        }
      });
  };

  const gotoRegister = () => {
    props.history.push("./register");
  };

  return (
    <div>
      <h1>Login</h1>
      <br />
      <div>
        Username
        <br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password
        <br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && (
        <>
          <small style={{ color: "red" }}>{error}</small>
          <br />
        </>
      )}
      <br />
      <input
        type="button"
        value="Register"
        onClick={gotoRegister}
        disabled={loading}
      />
      <input
        type="button"
        value={loading ? "Loading..." : "Login"}
        onClick={handleLogin}
        disabled={loading}
      />
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
