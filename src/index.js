import React from "react";
import { createElement } from "./createElement";

React.createElement = createElement;

export default React;
export * from "react";
export { createElement } from "./createElement";
export { useStateAtom, useSubscription } from "./hooks";
