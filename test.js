function getNextValue(array, value) {
  const len = array.length;
  const valueIndex = array.findIndex((e) => e == value);
  if (valueIndex == -1) return "";
  if (valueIndex < len - 1) {
    return array[valueIndex + 1];
  } else {
    return array[0];
  }
}

async function main() {
  const arr = [1, 2];

  console.log(getNextValue(arr, 2))
}

main();