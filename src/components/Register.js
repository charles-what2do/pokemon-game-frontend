import React, { useState } from "react";
import axios from "axios";
const baseURL = "http://localhost:3001/user";

function Register(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput("");
  const password = useFormInput("");
  const repeatPassword = useFormInput("");
  const [error, setError] = useState(null);

  const handleRegister = () => {
    setError(null);
    setLoading(true);
    if (password.value !== "" && password.value === repeatPassword.value) {
      axios({
        method: "post",
        url: baseURL + "/register",
        data: {
          username: username.value,
          password: password.value,
        },
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          setLoading(false);
          if (!!error.response) {
            if (error.response.status === 401) {
              setError(JSON.stringify(error.response.data));
            } else {
              setError("Something went wrong. Please try again later.");
            }
          } else {
            setError("Something went wrong. Please try again later.");
          }
        });
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <br />
      <div>
        Username
        <br />
        <input type="text" {...username} />
      </div>
      <div style={{ marginTop: 10 }}>
        Password
        <br />
        <input type="password" {...password} />
      </div>
      <div style={{ marginTop: 10 }}>
        Repeat Password
        <br />
        <input type="password" {...repeatPassword} />
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
        value={loading ? "Registering..." : "Register"}
        onClick={handleRegister}
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

export default Register;
