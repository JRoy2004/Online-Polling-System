const isPollExpired = (expiresAt) => {
  return new Date(expiresAt) < new Date();
};

export default isPollExpired;
