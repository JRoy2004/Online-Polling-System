export const calculateTotalVotes = (poll) => {
  return poll.options.reduce(
    (accumulator, currentValue) => (accumulator += currentValue.votes),
    0
  );
};
