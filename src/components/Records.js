import React, { useState, useEffect } from "react";
import "./Records.css";
import { getRecords, rankingSufix } from "../utils/Common";

function Records(props) {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUserRecords() {
      await getRecords(setRecords, setError);
    }
    getUserRecords();
  }, []);

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

  const showRecords = (recordType) => {
    return (
      <div className={`${recordType.toLowerCase()}-list`}>
        <h2>{recordType + "S"}</h2>
        <ul>
          <span>
            <b>Ranking</b>
          </span>
          <span>
            <b>Time</b>
          </span>
        </ul>
        {records
          .sort(function (a, b) {
            return a.recordTime - b.recordTime;
          })
          .filter((record) => record.recordType === recordType)
          .map((record, index) => (
            <ul key={record.id}>
              <span>{rankingSufix(index)}</span>{" "}
              <span>{record.recordTime}s</span>
            </ul>
          ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Your Records</h1>
      <div className="records">
        {showRecords("WIN")}
        {showRecords("LOSE")}
      </div>
      <button onClick={gotoGame}>
        <span>Back To Game </span>
      </button>
      <button
        onClick={() => {
          handleLogout();
        }}
      >
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
