const CARD_PER_PLAYER = 3;

const shuffle = (cards) => {
  let currentIndex = cards.length;

  while (0 !== currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    const temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  return cards;
};

const dealCards = (cards) => {
  const gameCards = { player1: [], player2: [] };

  const shuffledCards = shuffle(cards);
  const cardPerPlayer =
    Math.floor(shuffledCards.length / 2) < CARD_PER_PLAYER
      ? Math.floor(shuffledCards.length / 2)
      : CARD_PER_PLAYER;
  for (let i = 0; i < cardPerPlayer * 2; i++) {
    const isOdd = i % 2 === 0;
    if (isOdd) {
      gameCards.player1.push(cards[i]);
    } else {
      gameCards.player2.push(cards[i]);
    }
  }

  return gameCards;
};

module.exports = { dealCards };
