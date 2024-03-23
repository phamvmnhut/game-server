export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index lower than the current element
    const j = Math.floor(Math.random() * (i + 1));
    // Swap the elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getNextValue(array, value) {
  const len = array.length;
  const valueIndex = array.findIndex((e) => e == value);
  if (valueIndex == -1) return "";
  if (valueIndex < len - 1) {
    return array[valueIndex + 1];
  } else {
    return array[0];
  }
}
