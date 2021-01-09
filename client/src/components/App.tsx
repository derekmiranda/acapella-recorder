import LoopRecorder from "../lib/LoopRecorder";
import {
  RecorderActionType,
  startRecording,
  stopRecording,
  useRecorderDispatch,
  useRecorderState,
} from "../providers/RecorderStateProvider";
import Tracklist from "./Tracklist";

export interface AppProps {
  recorder: LoopRecorder;
}

function App({ recorder }: AppProps) {
  const {
    recordingAvailable,
    isRecording,
    initializingRecord,
    tracks,
  } = useRecorderState();
  const dispatch = useRecorderDispatch();

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    dispatch({ type: RecorderActionType.recordingUnavailable });
  }

  const onStartRecord = () => {
    startRecording(dispatch, recorder);
  };

  const onStopRecord = () => {
    stopRecording(dispatch, recorder);
  };

  let recordBtnText = "Record",
    recordBtnClass = "record__btn";

  if (initializingRecord) {
    recordBtnText = "Initializing...";
  } else if (isRecording) {
    recordBtnText = "Stop";
    recordBtnClass = "record__btn record__btn--recording";
  }

  return (
    <div className="app">
      <h1 className="app__header">Acapella Recorder</h1>
      {recordingAvailable ? (
        <>
          <div className="record">
            <button
              className={recordBtnClass}
              onClick={isRecording ? onStopRecord : onStartRecord}
              disabled={initializingRecord}
            >
              {recordBtnText}
            </button>
            <span className="record__description">Record a first track!</span>
          </div>
          <div className="playback">
            <button>Play All</button>
          </div>
          <Tracklist tracks={tracks} />
        </>
      ) : (
        <p className="error-message">
          Audio isRecording is not available with this browser. Please use a
          compatible browser listed{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://caniuse.com/?search=getusermedia"
          >
            here
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
