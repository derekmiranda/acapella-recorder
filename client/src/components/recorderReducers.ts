import { combineReducers, createIdGetter } from "../lib/utils";
import {
  RecorderState,
  RecorderAction,
  SettingsAction,
  RecorderActionType,
  TrackAction,
} from "../providers/RecorderProvider";

const getNewId = createIdGetter();

function recordingReducer(
  state: RecorderState,
  action: RecorderAction
): RecorderState {
  switch (action.type) {
    case RecorderActionType.startRecording: {
      return {
        ...state,
        isRecording: true,
      };
    }
    case RecorderActionType.stopRecording: {
      return {
        ...state,
        isRecording: false,
      };
    }
    case RecorderActionType.initializingRecord: {
      return {
        ...state,
        initializingRecord: true,
      };
    }
    case RecorderActionType.doneInitializingRecord: {
      return {
        ...state,
        initializingRecord: false,
      };
    }
    case RecorderActionType.recordingUnavailable: {
      return {
        ...state,
        recordingAvailable: false,
      };
    }
  }
  return state;
}

function tracksReducer(
  state: RecorderState,
  action: TrackAction
): RecorderState {
  switch (action.type) {
    case RecorderActionType.addTrack: {
      const url = action.url as string;
      return {
        ...state,
        tracks: state.tracks.concat({
          url,
          name: "New Track",
          id: getNewId(),
          active: true,
          volume: 1,
        }),
      };
    }
    case RecorderActionType.renameTrack: {
      const id = action.id as number;
      const name = action.name as string;
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === id) {
            return {
              ...track,
              name,
            };
          }
          return track;
        }),
      };
    }
    case RecorderActionType.removeTrack: {
      const id = action.id as number;
      return {
        ...state,
        tracks: state.tracks.filter((track) => {
          return track.id !== id;
        }),
      };
    }
  }
  return state;
}

function settingsReducer(
  state: RecorderState,
  action: SettingsAction
): RecorderState {
  switch (action.type) {
    case RecorderActionType.toggleMetronome: {
      return {
        ...state,
        useMetronome: !state.useMetronome,
      };
    }
    case RecorderActionType.toggleTestingMetronome: {
      return {
        ...state,
        testingMetronome: !state.testingMetronome,
      };
    }
    case RecorderActionType.togglePlayWhileRecording: {
      return {
        ...state,
        playWhileRecording: !state.playWhileRecording,
      };
    }
    case RecorderActionType.updateMetronomeTempo: {
      return {
        ...state,
        metronomeTempo: action.metronomeTempo as number,
      };
    }
  }
  return state;
}

export const rootRecoderReducer = combineReducers([
  recordingReducer,
  tracksReducer,
  settingsReducer,
]);
