import React, { Dispatch, ReactNode, Reducer } from "react";
import LoopRecorder from "../lib/LoopRecorder";
import { rootRecoderReducer } from "./recorderReducers";

const RecorderStateContext = React.createContext<RecorderState | undefined>(
  undefined
);
const RecorderDispatchContext = React.createContext<
  Dispatch<RecorderAction> | undefined
>(undefined);

export interface RecorderState {
  recordingAvailable: boolean;
  isRecording: boolean;
  initializingRecord: boolean;
  tracks: Track[];
  shouldLoop: boolean;
}

export interface Track {
  name: string;
  url: string;
  id: number;
  active: boolean;
  volume: number;
}

export enum RecorderActionType {
  // recording
  startRecording,
  stopRecording,
  initializingRecord,
  doneInitializingRecord,
  recordingUnavailable,
  // tracks
  addTrack,
  removeTrack,
  renameTrack,
  // playback
  playAll,
  playOne,
  pause,
  stop,
}

export interface TrackAction extends RecorderAction {
  type: RecorderActionType;
  url?: string;
  name?: string;
  id?: number;
}

export interface RecorderAction {
  type: RecorderActionType;
}

async function startRecording(
  dispatch: Dispatch<RecorderAction>,
  recorder: LoopRecorder
) {
  dispatch({ type: RecorderActionType.initializingRecord });
  try {
    await recorder.startRecording();
    dispatch({ type: RecorderActionType.doneInitializingRecord });
    dispatch({ type: RecorderActionType.startRecording });
  } catch (error) {
    console.error("Error starting recording");
    throw error;
  }
}

async function stopRecording(
  dispatch: Dispatch<RecorderAction>,
  recorder: LoopRecorder
) {
  dispatch({ type: RecorderActionType.stopRecording });
  try {
    const url = await recorder.flushRecording();
    dispatch({ type: RecorderActionType.addTrack, url } as TrackAction);
  } catch (error) {
    console.error("Error stopping recording");
    throw error;
  }
}

function RecorderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = React.useReducer<
    Reducer<RecorderState, RecorderAction>
  >(rootRecoderReducer, {
    recordingAvailable: true,
    isRecording: false,
    initializingRecord: false,
    tracks: [],
    shouldLoop: true,
  });
  return (
    <RecorderStateContext.Provider value={state}>
      <RecorderDispatchContext.Provider value={dispatch}>
        {children}
      </RecorderDispatchContext.Provider>
    </RecorderStateContext.Provider>
  );
}

function useRecorderState() {
  const context = React.useContext(RecorderStateContext);
  if (context === undefined) {
    throw new Error("useRecorderState must be used within a RecorderProvider");
  }
  return context;
}

function useRecorderDispatch() {
  const context = React.useContext(RecorderDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useRecorderDispatch must be used within a RecorderProvider"
    );
  }
  return context;
}

export {
  RecorderProvider,
  useRecorderState,
  useRecorderDispatch,
  startRecording,
  stopRecording,
};