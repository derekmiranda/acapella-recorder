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
