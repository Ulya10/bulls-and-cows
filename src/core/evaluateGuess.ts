export const evaluateGuess = (secret: string, guess: string): { bulls: number; cows: number } => {
  const secretChars = [...secret.toLowerCase()];
  const guessChars = [...guess.toLowerCase()];

  const bulls = guessChars.filter((char, i) => char === secretChars[i]).length;
  const secretSet = new Set(secretChars);
  const totalMatches = guessChars.filter((char) => secretSet.has(char)).length;

  return { bulls, cows: totalMatches - bulls };
};
