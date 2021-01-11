import { Reducer } from "react";

export function combineReducers(
  reducers: Reducer<any, any>[]
): Reducer<any, any> {
  return function (state, action) {
    for (let reducer of reducers) {
      state = reducer(state, action);
    }
    return state;
  };
}

export function createIdGetter(): () => number {
  let id = -1;
  return function getNewId() {
    if (id < Number.MAX_SAFE_INTEGER) {
      id += 1;
    } else {
      id = 0;
    }
    return id;
  };
}

// abstracted setInterval, in case I want to reimplement w/ RAF
export function setInterval(
  handler: TimerHandler,
  timeout?: number,
  ...args: unknown[]
): number {
  return window.setInterval(handler, timeout, ...args);
}
