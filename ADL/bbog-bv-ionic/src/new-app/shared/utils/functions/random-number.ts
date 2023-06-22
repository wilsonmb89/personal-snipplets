const getRandomInt = (min: number, max: number) => {
  const byteArray = new Uint8Array(1);
  window.crypto.getRandomValues(byteArray);

  const range = max - min + 1;
  const max_range = 256;
  if (byteArray[0] >= Math.floor(max_range / range) * range) {
    return getRandomInt(min, max);
  }
  return min + (byteArray[0] % range);
};

export default getRandomInt;
