import axios from "axios";

export const hasLoggedIn = async () => {
  await axios({
    method: "get",
    url: process.env.REACT_APP_BACKEND_API + "/user",
    withCredentials: true,
  })
    .then((res) => {
      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      return false;
    });
};

export const registerUser = async (user, successHandler, errorHandler) => {
  await axios({
    method: "post",
    url: process.env.REACT_APP_BACKEND_API + "/user/register",
    data: {
      username: user.username,
      password: user.password,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        successHandler();
      } else {
        errorHandler("Something went wrong. Please try again later.");
      }
    })
    .catch((error) => {
      if (!!error.response) {
        if (error.response.status === 400) {
          errorHandler(JSON.stringify(error.response.data));
        } else {
          errorHandler("Something went wrong. Please try again later.");
        }
      } else {
        errorHandler("Something went wrong. Please try again later.");
      }
    });
};

export const loginUser = async (user, successHandler, errorHandler) => {
  console.log(process.env.REACT_APP_BACKEND_API);
  await axios({
    method: "post",
    url: process.env.REACT_APP_BACKEND_API + "/user/login",
    data: {
      username: user.username,
      password: user.password,
    },
    withCredentials: true,
  })
    .then((response) => {
      if (response.status === 200) {
        successHandler();
      } else {
        errorHandler("Something went wrong. Please try again later.");
      }
    })
    .catch((error) => {
      if (!!error.response) {
        if (error.response.status === 400) {
          errorHandler(JSON.stringify(error.response.data));
        } else {
          errorHandler("Something went wrong. Please try again later.");
        }
      } else {
        errorHandler("Something went wrong. Please try again later.");
      }
    });
};

export const logoutUser = async (successHandler, errorHandler) => {
  await axios({
    method: "post",
    url: process.env.REACT_APP_BACKEND_API + "/user/logout",
    withCredentials: true,
  })
    .then((response) => {
      successHandler();
    })
    .catch((error) => {
      if (!!error.response) {
        if (error.response.status === 400) {
          errorHandler(JSON.stringify(error.response.data));
        } else {
          errorHandler("Something went wrong. Please try again later.");
        }
      } else {
        errorHandler("Something went wrong. Please try again later.");
      }
    });
};

export const getUsername = async (successHandler, errorHandler) => {
  await axios({
    method: "get",
    url: process.env.REACT_APP_BACKEND_API + "/user",
    withCredentials: true,
  })
    .then((res) => {
      successHandler(res.data.username);
    })
    .catch((error) => {
      // errorHandler(JSON.stringify(error));
    });
};

export const getRecords = async (successHandler, errorHandler) => {
  await axios({
    method: "get",
    url: process.env.REACT_APP_BACKEND_API + "/user/records",
    withCredentials: true,
  })
    .then((res) => {
      successHandler(res.data);
    })
    .catch((error) => {
      errorHandler(error);
    });
};

export const addRecord = async (record, successHandler, errorHandler) => {
  await axios({
    method: "post",
    url: process.env.REACT_APP_BACKEND_API + "/user/records",
    data: record,
    withCredentials: true,
  })
    .then((res) => {
      successHandler(res.data);
    })
    .catch((error) => {
      errorHandler(error);
    });
};

export const rankingSufix = (index) => {
  const rank = index + 1;
  if (rank % 10 === 1) {
    return rank + "st";
  } else if (rank % 10 === 2) {
    return rank + "nd";
  } else if (rank % 10 === 3) {
    return rank + "rd";
  } else {
    return rank + "th";
  }
};
