import React, { useState, useEffect } from "react";
import { getUsername } from "../utils/Common";
import "./Start.css";

function Start(props) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function callGetUsername() {
      await getUsername(setUsername, setError);
    }
    callGetUsername();
  }, []);

  const gotoRecords = () => {
    props.history.push("./records");
  };

  const gotoGame = () => {
    props.history.push("./game");
  };

  const logoutHandler = () => {
    props.setLoggedIn(false);
    props.history.push("/login");
  };

  const handleLogout = () => {
    setError(null);
    props.logout(logoutHandler, setError);
  };

  return (
    <div className="start-menu">
      <h1>Welcome {username}</h1>
      <br />
      <button className="start-button" onClick={gotoGame}>
        <span>Start Game </span>
      </button>
      <button className="start-button" onClick={gotoRecords}>
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
