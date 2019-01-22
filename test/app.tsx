import * as F from "francis";
import { render } from "react-dom";
import React, { useState, useStateAtom, useEffect } from "../src/index";

const BasicTest = () => {
  const count = F.atom(0);
  const updateCount = F.modify(count);
  return (
    <div>
      <p>Counter is: {count}</p>
      <div>
        <button onClick={() => updateCount(s => s + 1)}>++</button>
        <button onClick={() => updateCount(s => s - 1)}>--</button>
      </div>
    </div>
  );
};

const StylePropsTest = () => {
  const display = F.pipe(
    F.later(1000, "none"),
    F.toPropertyWith("inline")
  );

  return (
    <div id="styled">
      This text <span style={{ display }}>is</span> visible!
    </div>
  );
};

interface InnerProps {
  indent: () => void;
}

const WithLocalState = ({ indent }: InnerProps) => {
  const state = useStateAtom("!");
  return (
    <span>
      <span>Hello{state}</span>
      <span style={{ marginLeft: 10 }}>
        <button onClick={() => F.modify(state, s => s + "!")}>!</button>
        <button onClick={indent}>></button>
      </span>
    </span>
  );
};

const LocalStateTest = () => {
  const [indentation, setIndent] = useState(">");
  const indent = () => setIndent(i => i + ">");
  return (
    <div>
      {indentation} <WithLocalState indent={indent} />
    </div>
  );
};

interface DelayedProps {
  val: F.Observable<string>;
}

const Delayed = ({ val }: DelayedProps) => {
  return <div>{val}</div>;
};

const SuspenseTest = () => {
  const val = F.later(500, "Tsers");
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Delayed val={val} />
    </React.Suspense>
  );
};

const Intermediate = (props: DelayedProps) => {
  return <Delayed {...props} />;
};

const AbortedSuspenseTest = () => {
  const [aborted, setAborted] = useState(false);
  const [disposed, setDisposed] = useState(false);
  useEffect(() => {
    const tid = setTimeout(() => setAborted(true), 500);
    return () => clearTimeout(tid);
  });

  const val = F.fromBinder(() => {
    return () => {
      setDisposed(true);
    };
  });

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {aborted ? (
        <div>Aborted/{disposed ? "Disposed" : ""}</div>
      ) : (
        <Intermediate val={val} />
      )}
    </React.Suspense>
  );
};

type Test =
  | "basic"
  | "localState"
  | "suspense"
  | "abortedSuspense"
  | "styleProps";

const Root = () => {
  const [test, setTest] = useState<Test>("basic");
  return (
    <div>
      <header>
        <button onClick={() => setTest("basic")}>Basic test</button>
        <button onClick={() => setTest("styleProps")}>Style props test</button>
        <button onClick={() => setTest("localState")}>Local state test</button>
        <button onClick={() => setTest("suspense")}>Suspense test</button>
        <button onClick={() => setTest("abortedSuspense")}>
          Aborted suspense test
        </button>
      </header>
      {test === "basic" ? (
        <BasicTest />
      ) : test === "styleProps" ? (
        <StylePropsTest />
      ) : test === "localState" ? (
        <LocalStateTest />
      ) : test === "suspense" ? (
        <SuspenseTest />
      ) : test === "abortedSuspense" ? (
        <AbortedSuspenseTest />
      ) : null}
    </div>
  );
};

render(<Root />, document.getElementById("app"));
