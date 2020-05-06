import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Start.css";
const baseURL = "http://localhost:3001/user";

function Records(props) {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (records.length === 0) {
      axios({
        method: "get",
        url: baseURL + "/records",
        withCredentials: true,
      })
        .then((res) => {
          console.log(res.data);
          setRecords(res.data);
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
        props.history.push("/login");
      })
      .catch((error) => {
        if (!!error.response) {
          if (error.response.status === 400) {
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
      <h1>Your Records</h1>
      <br />
      {records
        .sort(function (a, b) {
          return a.recordTime - b.recordTime;
        })
        .map((record) => (
          <h2 key={record.id}>
            {record.recordType} {record.recordTime}s
          </h2>
        ))}
      <button className="start-button" onClick={gotoGame}>
        <span>Back To Game </span>
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

export default Records;
