import React, { Dispatch, ReactNode, Reducer } from "react";
import PlaybackManager from "../lib/PlaybackManager";

const PlaybackStateContext = React.createContext<PlaybackState | undefined>(
  undefined
);
const PlaybackDispatchContext = React.createContext<
  Dispatch<PlaybackAction> | undefined
>(undefined);
const PlaybackManagerContext = React.createContext<PlaybackManager | undefined>(
  undefined
);

export interface PlaybackState {
  playing: boolean;
  paused: boolean;
  stopped: boolean;
  trackTime: number;
}

export enum PlaybackActionType {
  playAll,
  playOne,
  pause,
  stop,
}

export interface PlaybackAction {
  type: PlaybackActionType;
}

function rootReducer(
  state: PlaybackState,
  action: PlaybackAction
): PlaybackState {
  switch (action.type) {
  }
  return state;
}

function PlaybackProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = React.useReducer<
    Reducer<PlaybackState, PlaybackAction>
  >(rootReducer, {
    playing: false,
    paused: false,
    stopped: true,
    trackTime: 0,
  });
  const playbackManager = React.useRef(new PlaybackManager());

  return (
    <PlaybackStateContext.Provider value={state}>
      <PlaybackDispatchContext.Provider value={dispatch}>
        <PlaybackManagerContext.Provider value={playbackManager.current}>
          {children}
        </PlaybackManagerContext.Provider>
      </PlaybackDispatchContext.Provider>
    </PlaybackStateContext.Provider>
  );
}

function usePlaybackState() {
  const context = React.useContext(PlaybackStateContext);
  if (context === undefined) {
    throw new Error("usePlaybackState must be used within a PlaybackProvider");
  }
  return context;
}

function usePlaybackDispatch() {
  const context = React.useContext(PlaybackDispatchContext);
  if (context === undefined) {
    throw new Error(
      "usePlaybackDispatch must be used within a PlaybackProvider"
    );
  }
  return context;
}

function usePlaybackManager() {
  const context = React.useContext(PlaybackManagerContext);
  if (context === undefined) {
    throw new Error(
      "usePlaybackManager must be used within a PlaybackProvider"
    );
  }
  return context;
}

export {
  PlaybackProvider,
  usePlaybackState,
  usePlaybackDispatch,
  usePlaybackManager,
};
