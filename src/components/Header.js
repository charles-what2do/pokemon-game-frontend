import React from "react";
import "./Header.css";
import SearchablePokemonGallery from "./SearchablePokemonGallery";
import PokemonCardGame from "./PokemonCardGame";
import About from "./About";
import Register from "./Register";
import Login from "./Login";
import Start from "./Start";
import { BrowserRouter, NavLink, Switch, Route } from "react-router-dom";

const Header = () => {
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
        <Switch>
          <Route exact path="/" component={SearchablePokemonGallery} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/start" component={Start} />
          <Route exact path="/game" component={PokemonCardGame} />
          <Route exact path="/about" component={About} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default Header;
