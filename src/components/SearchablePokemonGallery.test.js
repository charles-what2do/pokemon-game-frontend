import React from "react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import "@testing-library/jest-dom/extend-expect";
import {
  render,
  fireEvent,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import SearchablePokemonGallery from "./SearchablePokemonGallery";
import mockPokemonData from "../data/pokemonData";

const mockAxios = new MockAdapter(axios);

const renderAndWaitForPokemonGalleryToLoad = async () => {
  const pokemonGallery = render(<SearchablePokemonGallery />);
  await waitForElementToBeRemoved(() =>
    pokemonGallery.getByLabelText("audio-loading")
  );
  return pokemonGallery;
};

describe("SearchablePokemonGallery", () => {
  beforeAll(() => {
    mockAxios
      .onGet(
        "https://us-central1-pokedex-23fb6.cloudfunctions.net/app/pokemonData"
      )
      .reply(200, mockPokemonData);
  });

  afterAll(() => {
    mockAxios.reset();
  });

  it("should render loader", () => {
    const { getByLabelText } = render(<SearchablePokemonGallery />);
    const loader = getByLabelText("audio-loading");
    expect(loader).toBeInTheDocument();
  });

  it("should render pokemon gallery component", async () => {
    // const { getByTestId, getByLabelText } = render(
    //   <SearchablePokemonGallery />
    // );
    // await waitForElementToBeRemoved(() => getByLabelText("audio-loading"));

    const { getByTestId } = await renderAndWaitForPokemonGalleryToLoad();
    const pokemonGallery = getByTestId("pokemon-gallery");
    expect(pokemonGallery).toBeInTheDocument();
  });

  it("should render input box", async () => {
    const { getByLabelText } = await renderAndWaitForPokemonGalleryToLoad();
    const getPokemonFilterInput = getByLabelText("pokemon-filter");
    expect(getPokemonFilterInput).toBeInTheDocument();
  });

  it("should render search button", async () => {
    const { getByLabelText } = await renderAndWaitForPokemonGalleryToLoad();
    const getSearchButton = getByLabelText("search-button");
    expect(getSearchButton).toBeInTheDocument();
  });

  it("should render 51 pokemons", async () => {
    const { getAllByTestId } = await renderAndWaitForPokemonGalleryToLoad();
    const pokemonCards = getAllByTestId("pokemon");
    expect(pokemonCards).toHaveLength(51);
  });

  it("should filter and show the correct cards", async () => {
    const {
      getByLabelText,
      getByTestId,
      getByText,
    } = await renderAndWaitForPokemonGalleryToLoad();

    const getPokemonFilterInput = getByLabelText("pokemon-filter");
    fireEvent.change(getPokemonFilterInput, {
      target: {
        value: "Bulbasaur",
      },
    });
    const getSearchButton = getByLabelText("search-button");
    fireEvent.click(getSearchButton);
    const bulbasurCard = getByTestId("pokemon");
    expect(bulbasurCard).toBeInTheDocument();
    expect(getByText("Bulbasaur")).toBeInTheDocument();
  });

  it("should filter ans show the correct cards even if input is all uppercase", async () => {
    const {
      getByLabelText,
      getByTestId,
      getByText,
    } = await renderAndWaitForPokemonGalleryToLoad();

    const getPokemonFilterInput = getByLabelText("pokemon-filter");
    fireEvent.change(getPokemonFilterInput, {
      target: {
        value: "BULBASAUR",
      },
    });
    const getSearchButton = getByLabelText("search-button");
    fireEvent.click(getSearchButton);
    const bulbasurCard = getByTestId("pokemon");
    expect(bulbasurCard).toBeInTheDocument();
    expect(getByText("Bulbasaur")).toBeInTheDocument();
  });

  it("should container 7 stats per pokemon", async () => {
    const { getAllByTestId } = await renderAndWaitForPokemonGalleryToLoad();
    const bulbasurCard = getAllByTestId("pokemon")[0];
    const getBulbasaurText = within(bulbasurCard).getByText;

    const stats = [
      "HP: 45",
      "Attack: 49",
      "Defence: 49",
      "Speed: 45",
      "SpAttack: 65",
      "SpDefence: 65",
    ];

    stats.forEach((stat) => {
      expect(getBulbasaurText(stat)).toBeInTheDocument();
    });
  });

  it("should show correct number of types", async () => {
    const { getAllByTestId } = await renderAndWaitForPokemonGalleryToLoad();
    const bulbasurCard = getAllByTestId("pokemon")[0];
    const getBulbasaurText = within(bulbasurCard).getByText;

    const types = ["Grass", "Poison"];

    types.forEach((stat) => {
      expect(getBulbasaurText(stat)).toBeInTheDocument();
    });
  });
});
