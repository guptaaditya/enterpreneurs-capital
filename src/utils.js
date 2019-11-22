export function addNumbers(num1,num2) {
    let a = num1.toString().split("").map(Number).reverse();
    let b = num2.toString().split("").map(Number).reverse();
    let ret = [];
    let carry = 0;
    let i = 0;
    if (a.length > b.length)
      return addNumbers(num2,num1);

    for (i = 0; i < a.length; i++) {
      let t = a[i] + b[i] + carry;
      ret[i] = t % 10;
      carry = (t > 9 ? 1 : 0);
    }
    while (i < b.length)
    {
      let t = b[i] + carry;
      ret[i++] = t % 10;
      carry = (t > 9 ? 1 : 0);
    }
    if (carry === 1) ret[i] = 1;
    return ret.reverse().join("");
};
export function toIntNotation(number) {
  let stringified = number.toString();
  // if (stringified.length >= 10 && stringified.length < 13) {
  if (stringified.length >= 10) {
      return ((number/Math.pow(10,9)).toFixed(3).toLocaleString('en') + ' Billion');
  } else if (stringified.length >= 13) {
      return ((number/Math.pow(10,12)).toFixed(3).toLocaleString('en') + ' Trillion');
  }
  return number.toLocaleString('en');
};

export const storage = {
  export: function (storageKey, data) {
    this.exportAsIs(storageKey, JSON.stringify(data))
  },
  import: function (storageKey) {
    const data = this.importAsIs(storageKey);
    let output = null;
    if (data) {
      try {
        output = JSON.parse(data);
      } catch (e) {
        console.log(e);
      }
    }
    return output;
  },
  exportAsIs: (key, dataString) => window.localStorage.setItem(key, dataString),
  importAsIs: (key) => window.localStorage.getItem(key),
};
