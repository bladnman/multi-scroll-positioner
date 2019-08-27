export default function invertSign(number) {
  if (number === undefined || number === null) return null;
  if (typeof number !== 'number') return null;
  if (number < 0 || number > 0) {
    number *= -1;
  }
  return number;
}
