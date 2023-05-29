export function validateCuil(cuil: string): boolean {
  if (cuil.length !== 11) {
    return false;
  }

  const [checkDigit, ...rest] = cuil
    .split('')
    .map(Number)
    .reverse();

  const total = rest.reduce(
    (acc, cur, index) => acc + cur * (2 + (index % 6)),
    0,
  );

  const module11 = 11 - (total % 11);

  if (module11 === 11) {
    return checkDigit === 0;
  }

  if (module11 === 10) {
    return false;
  }

  return checkDigit === module11;
}