import { isObservable } from "francis";

/*#__PURE__*/
export function isObject(x) {
  if (!!x && typeof x === "object") {
    const proto = Object.getPrototypeOf(x);
    return proto === Object.prototype || proto === null;
  } else {
    return false;
  }
}

export function collectObservables(input, output) {
  let has = false;
  const keys = Object.keys(input);
  const n = keys.length;
  if (n === 0) {
    return void 0;
  }
  for (let i = 0; i < n; i++) {
    const k = keys[i];
    const v = input[k];
    if (isObservable(v)) {
      if (has === false) {
        has = true;
      }
      output[k] = v;
    }
  }
  return has;
}
