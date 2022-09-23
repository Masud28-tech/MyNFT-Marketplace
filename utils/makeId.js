export const makeId = (length) => {
  let result = '';
  const letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
};
