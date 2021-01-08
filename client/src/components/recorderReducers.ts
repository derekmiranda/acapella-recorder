import { combineReducers } from "../lib/utils";
import {
  RecorderState,
  RecorderAction,
  RecorderActionType,
  TrackAction,
} from "./RecorderStateProvider";

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
  }
  return state;
}

export const rootRecoderReducer = combineReducers([
  recordingReducer,
  tracksReducer,
]);

let id = -1;
function getNewId() {
  if (id < Number.MAX_SAFE_INTEGER) {
    id += 1;
  } else {
    id = 0;
  }
  return id;
}
