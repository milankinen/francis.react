import { isError, isNext, subscribe } from "francis";
import React, { useState, useEffect } from "react";
import { isObject, collectObservables as collect } from "./_util";

const $ = React.createElement;
const LIFT = "francis-lift";

let stateInstanceCache = {};
let instanceId = 0;

const Wrapper = props => {
  const s = useState({ id: instanceId++ });
  const state = s[0];
  const instance = activate(state.id, props, s[1]);
  useEffect(() => {
    return () => deactivate(state.id);
  }, []);
  return $(Value, { instance });
};

Wrapper.displayName = "Francis.Wrapper";

export function createElement(tag, props, ...ch) {
  if (typeof tag === "string" || (props && props[LIFT])) {
    const obs = { props: {}, ch: {}, style: {} };
    const style = props && props.style;
    const hasPropObs = props && collect(props, obs.props);
    const hasStyleObs = style && collect(props.style, obs.style);
    const hasChildObs = ch.length > 0 && collect(ch, obs.ch);
    if (hasPropObs || hasStyleObs || hasChildObs) {
      return $(Wrapper, {
        key: props ? props.key : undefined,
        tag,
        props,
        ch,
        obs
      });
    }
  }
  return $(tag, props, ...ch);
}

function Value({ instance }) {
  return instance.elem();
}

function activate(id, next, notify) {
  let instance = stateInstanceCache[id];
  if (instance === undefined) {
    instance = new StateInstance(id, notify);
    stateInstanceCache[id] = instance;
  }
  instance.activate(next);
  return instance;
}

function deactivate(id) {
  const instance = stateInstanceCache[id];
  if (instance !== undefined) {
    delete stateInstanceCache[id];
    instance.deactivate();
  }
}

class StateInstance {
  constructor(id, notify) {
    this.id = id;
    this.notify = notify;
    this.numPending = 0;
    this.subscriptions = { props: {}, ch: {}, style: {} };
    this.state = {};
    this.activating = false;
    this.current = void 0;
    this.promise = null;
    this.resolve = void 0;
  }

  notifyChange() {
    if (this.promise !== null) {
      const { resolve } = this;
      this.promise = null;
      this.resolve = void 0;
      resolve();
    }
    if (this.activating === false) {
      const { notify } = this;
      notify({ id: this.id });
    }
  }

  elem() {
    if (this.numPending === 0) {
      return $(this.current.tag, this.state.props, ...this.state.ch);
    } else {
      if (this.promise === null) {
        this.promise = new Promise(resolve => (this.resolve = resolve));
      }
      throw this.promise;
    }
  }

  activate(next) {
    if (next !== this.current) {
      const { props, ch, obs } = next;
      this.current = next;
      this.activating = true;
      const { state, subscriptions } = this;
      state.props = Object.assign({}, props);
      state.ch = ch.slice();
      this.subs(state, subscriptions.props, obs.props, updateProp);
      this.subs(state, subscriptions.ch, obs.ch, updateChild);
      this.subs(state, subscriptions.style, obs.style, updateStyle);
      this.activating = false;
    }
  }

  deactivate() {
    const { subscriptions } = this;
    this.prev = this.notify = void 0;
    this.state = this.subscriptions = {};
    this.unsubs(subscriptions.props);
    this.unsubs(subscriptions.ch);
    this.unsubs(subscriptions.style);
  }

  unsubs(subscriptions) {
    const keys = Object.keys(subscriptions);
    for (let i = 0, n = keys.length; i < n; i++) {
      const key = keys[i];
      const s = subscriptions[key];
      const { dispose } = s;
      if (dispose !== null) {
        dispose();
      }
    }
  }

  subs(state, subscriptions, observables, f) {
    const keys = Object.keys(observables);
    for (let i = 0, n = keys.length; i < n; i++) {
      const key = keys[i];
      const obs = observables[key];
      let subscription = subscriptions[key];
      if (subscription !== undefined) {
        if (subscription.obs !== obs) {
          // we have existing subscription for the given key but for different observable
          // => we must dispose the existing subscription and subscribe to new observable
          const dispose = subscription.dispose;
          if (dispose !== null) {
            dispose();
          }
          ++this.numPending;
          subscription.obs = obs;
          subscription.value = void 0;
          subscription.ready = false;
          subscription.dispose = this.subscribe(obs, subscription, key, f);
        } else if (subscription.ready === true) {
          // we have existing subscription for same observable and it's ready
          // => copy the existing value to the state
          f(state, key, subscription.value);
        }
      } else {
        // no existing subscription, create entirely new one
        ++this.numPending;
        subscription = subscriptions[key] = {
          obs,
          ready: false,
          dispose: null,
          value: void 0
        };
        subscription.dispose = this.subscribe(obs, subscription, key, f);
      }
    }
  }

  subscribe(obs, subscription, key, f) {
    return subscribe(this.onEvent.bind(this, key, subscription, f), obs);
  }

  onEvent(key, subscription, f, event) {
    if (isNext(event)) {
      const { state } = this;
      const value = (subscription.value = event.value);
      const changed = f(state, key, value);
      if (subscription.ready === false) {
        subscription.ready = true;
        --this.numPending;
      }
      if (changed === true && this.numPending === 0) {
        this.notifyChange();
      }
    } else if (isError(event)) {
      if (typeof console !== "undefined") {
        console.error("Unhandled observable error in VDOM subscriber");
        console.error(event.error);
      }
    } else {
      // TODO: how to handle end? perhaps cache the final value?
    }
  }
}

function updateProp(state, key, value) {
  if (state.props[key] !== value) {
    state.props[prop] = value;
    return true;
  }
  return false;
}

function updateStyle(state, key, value) {
  const style = state.props.style;
  if (isObject(style)) {
    if (style[key] !== value) {
      state.props.style = Object.assign({}, style, {
        [key]: value
      });
      return true;
    }
  } else {
    state.props.value = { [key]: value };
    return true;
  }
  return false;
}

function updateChild(state, key, value) {
  const idx = parseInt(key);
  if (state.ch[idx] !== value) {
    state.ch[idx] = value;
    return true;
  }
  return false;
}
