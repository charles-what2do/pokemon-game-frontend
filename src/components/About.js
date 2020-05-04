import React from "react";

const About = () => {
  return (
    <div>
      <h1>About</h1>
      <img
        src={process.env.PUBLIC_URL + "/pokemon_about.jpg"}
        alt="Pokemon About Banner"
      />
      <p>
        Pokémon are creatures of all shapes and sizes who live in the wild or
        alongside humans. For the most part, Pokémon do not speak except to
        utter their names. There are currently more than 700 creatures that
        inhabit the Pokémon universe. Pokémon are raised and commanded by their
        owners (called “Trainers”).
      </p>
    </div>
  );
};

export default About;
