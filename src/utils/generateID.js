export function generateID(length = 9) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const number = Math.floor(min + Math.random() * (max - min + 1));
  return `#${number}`;
}
