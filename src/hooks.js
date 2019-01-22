import { atom, subscribe } from "francis";
import { useState, useEffect } from "react";
import { curry2 } from "./_util";

export const useStateAtom = initialState => {
  const s = useState(atom(initialState));
  return s[0];
};

export const useSubscription = curry2((f, observable) => {
  useEffect(() => {
    return subscribe(f, observable);
  }, []);
});
