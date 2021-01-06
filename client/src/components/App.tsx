import { useState } from "react";
import LoopRecorder from "../lib/LoopRecorder";
import Tracklist from "./Tracklist";

export interface AppProps {
  recorder: LoopRecorder;
}

function App({ recorder }: AppProps) {
  const [recordingAvailable, updateRecordingAvailable] = useState(true);
  const [recording, updateRecording] = useState(false);
  const [initializingRecord, updateInitializingRecord] = useState(false);
  const [trackURLs, updateTrackURLs]: [string[], Function] = useState([]);

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    updateRecordingAvailable(false);
  }

  const startRecording = () => {
    updateInitializingRecord(true);
    recorder.startRecording().then(() => {
      updateInitializingRecord(false);
      updateRecording(true);
    });
  };

  const stopRecording = () => {
    updateRecording(false);
    recorder.flushRecording().then((url) => {
      updateTrackURLs(trackURLs.concat(url));
    });
  };

  let recordBtnText = "Record",
    recordBtnClass = "record__btn";

  if (initializingRecord) {
    recordBtnText = "Initializing...";
  } else if (recording) {
    recordBtnText = "Recording...";
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
              onClick={recording ? stopRecording : startRecording}
              disabled={initializingRecord}
            >
              {recordBtnText}
            </button>
            <p className="record__description">Record a first track!</p>
          </div>
          <Tracklist tracks={trackURLs} />
        </>
      ) : (
        <p className="error-message">
          Audio recording is not available with this browser. Please use a
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
