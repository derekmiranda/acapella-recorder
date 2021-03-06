import React, { Dispatch, ReactNode, Reducer } from "react";
import LoopRecorder from "../lib/LoopRecorder";
import { rootRecoderReducer } from "../components/recorderReducers";
import { PlaybackAction, PlaybackActionType } from "./PlaybackProvider";

const RecorderStateContext = React.createContext<RecorderState | undefined>(
  undefined
);
const RecorderDispatchContext = React.createContext<
  Dispatch<RecorderAction> | undefined
>(undefined);
const RecorderContext = React.createContext<LoopRecorder | undefined>(
  undefined
);

export interface RecorderState {
  recordingAvailable: boolean;
  isRecording: boolean;
  initializingRecord: boolean;
  tracks: Track[];
  playWhileRecording: boolean;
  useMetronome: boolean;
  metronomeTempo: number;
  testingMetronome: boolean;
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
  toggleMetronome,
  updateMetronomeTempo,
  togglePlayWhileRecording,
  toggleTestingMetronome,
  // tracks
  addTrack,
  removeTrack,
  renameTrack,
}

export interface TrackAction extends RecorderAction {
  type: RecorderActionType;
  url?: string;
  name?: string;
  id?: number;
}

export interface SettingsAction extends RecorderAction {
  type: RecorderActionType;
  metronomeTempo?: number;
}

export interface RecorderAction {
  type: RecorderActionType;
}

async function startRecording({
  recorderDispatch,
  playbackDispatch,
  testingMetronome,
  playWhileRecording,
  recorder,
}: {
  recorderDispatch: Dispatch<RecorderAction>;
  playbackDispatch: Dispatch<PlaybackAction>;
  testingMetronome: boolean;
  playWhileRecording: boolean;
  recorder: LoopRecorder;
}) {
  recorderDispatch({ type: RecorderActionType.initializingRecord });
  try {
    await recorder.startRecording();
    recorderDispatch({ type: RecorderActionType.doneInitializingRecord });
    recorderDispatch({ type: RecorderActionType.startRecording });
    if (testingMetronome) {
      recorderDispatch({ type: RecorderActionType.toggleTestingMetronome });
    }
    if (playWhileRecording) {
      playbackDispatch({ type: PlaybackActionType.play });
    }
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
    tracks: [
      {
        name: "Sample 1",
        url: "./assets/sample-1.m4a",
        id: 99,
        active: true,
        volume: 1,
      },
      {
        name: "Sample 2",
        url: "./assets/sample-2.m4a",
        id: 999,
        active: true,
        volume: 1,
      },
    ],
    playWhileRecording: false,
    useMetronome: true,
    metronomeTempo: 120,
    testingMetronome: false,
  });
  const reducerRef = React.useRef(new LoopRecorder());

  return (
    <RecorderStateContext.Provider value={state}>
      <RecorderDispatchContext.Provider value={dispatch}>
        <RecorderContext.Provider value={reducerRef.current}>
          {children}
        </RecorderContext.Provider>
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

function useRecorder() {
  const context = React.useContext(RecorderContext);
  if (context === undefined) {
    throw new Error("useRecorder must be used within a RecorderProvider");
  }
  return context;
}

export {
  RecorderProvider,
  useRecorderState,
  useRecorderDispatch,
  useRecorder,
  startRecording,
  stopRecording,
};
