import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Start.css";
const baseURL = "http://localhost:3001/user";

function Start(props) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username === "") {
      axios({
        method: "get",
        url: baseURL + "/",
        withCredentials: true,
      })
        .then((res) => {
          setUsername(res.data.username);
        })
        .catch((error) => {
          setError(error);
        });
    }
  });

  const gotoGame = () => {
    props.history.push("./game");
  };

  const handleLogout = () => {
    setError(null);
    axios({
      method: "post",
      url: baseURL + "/logout",
    })
      .then((response) => {
        console.log(response);
        setUsername("");
        props.history.push("/login");
      })
      .catch((error) => {
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

  return (
    <div className="start-menu">
      <h1>Welcome {username}</h1>
      <br />
      <button className="start-button" onClick={gotoGame}>
        <span>Start Game </span>
      </button>
      <button className="start-button">
        <span>View Records </span>
      </button>
      <button className="start-button" onClick={handleLogout}>
        <span>Logout </span>
      </button>
      {error && (
        <>
          <small style={{ color: "red" }}>{error}</small>
          <br />
        </>
      )}
    </div>
  );
}

export default Start;
