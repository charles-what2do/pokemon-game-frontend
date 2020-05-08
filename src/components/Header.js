import React from "react";
import { useState } from "react";
import "./Header.css";
import SearchablePokemonGallery from "./SearchablePokemonGallery";
import PokemonCardGame from "./PokemonCardGame";
import About from "./About";
import Register from "./Register";
import Login from "./Login";
import Start from "./Start";
import Records from "./Records";
import { loginUser, logoutUser } from "../utils/Common";

import {
  BrowserRouter,
  NavLink,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const login = (user, loginHandler, errHandler) => {
    loginUser(user, loginHandler, errHandler);
  };

  const logout = (logoutHandler, errHandler) => {
    logoutUser(logoutHandler, errHandler);
  };

  const LoggedInRoutes = () => {
    return (
      <Switch>
        <Route exact path="/" component={SearchablePokemonGallery} />
        <Route path="/register" component={Register} />
        {isLoggedIn && (
          <Route
            path="/start"
            render={(props) => (
              <Start setLoggedIn={setLoggedIn} logout={logout} {...props} />
            )}
          />
        )}
        {isLoggedIn && (
          <Route
            path="/game"
            render={(props) => (
              <PokemonCardGame
                setLoggedIn={setLoggedIn}
                logout={logout}
                {...props}
              />
            )}
          />
        )}
        {isLoggedIn && (
          <Route
            path="/records"
            render={(props) => (
              <Records setLoggedIn={setLoggedIn} logout={logout} {...props} />
            )}
          />
        )}
        <Route path="/about" component={About} />
        <Redirect from="/login" to="/start" />
      </Switch>
    );
  };

  const notLoggedInRoutes = () => {
    return (
      <Switch>
        <Route exact path="/" component={SearchablePokemonGallery} />
        <Route path="/register" component={Register} />
        {!isLoggedIn && (
          <Route
            path="/login"
            render={(props) => (
              <Login setLoggedIn={setLoggedIn} login={login} {...props} />
            )}
          />
        )}
        <Redirect to="/login" />
      </Switch>
    );
  };

  return (
    <div>
      <BrowserRouter>
        <div className="header">
          <img
            className="header-image"
            src={process.env.PUBLIC_URL + "pokemon-750.jpg"}
            alt="Pokemon Header"
          />
          <div className="header-nav">
            <NavLink exact to="/">
              Pokemon Gallery
            </NavLink>
            <NavLink exact to="/login">
              Game
            </NavLink>
            <NavLink exact to="/about">
              About
            </NavLink>
          </div>
        </div>
        {isLoggedIn ? LoggedInRoutes() : notLoggedInRoutes()}
      </BrowserRouter>
    </div>
  );
};

{
  /* <Switch>
<Route exact path="/" component={SearchablePokemonGallery} />
<Route exact path="/register" component={Register} />
{/* <Route exact path="/login" component={Login} />
<Route exact path="/start" component={Start} />
<Route exact path="/game" component={PokemonCardGame} />
<Route exact path="/records" component={Records} /> 
<PublicRoute path="/login" component={Login} />
<PrivateRoute exact path="/start" component={Start} />
<PrivateRoute exact path="/game" component={PokemonCardGame} />
<PrivateRoute exact path="/records" component={Records} />
<Route exact path="/about" component={About} />
</Switch> */
}

export default Header;
