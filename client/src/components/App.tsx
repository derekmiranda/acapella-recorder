import { useState, useEffect } from "react";
import Tracklist from "./Tracklist";

function App() {
  const [recordingAvailable, updateRecordingAvailable] = useState(true);
  const [recording, updateRecording] = useState(false);

  const toggleRecording = () => {
    updateRecording(!recording);
  };

  // check if recording is available
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      updateRecordingAvailable(false);
    }
  }, []);

  return (
    <div className="app">
      <h1 className="app__header">Acapella Recorder</h1>
      {recordingAvailable ? (
        <>
          <div className="record">
            <button
              className={
                "record__btn" + (recording ? " record__btn--recording" : "")
              }
              onClick={toggleRecording}
            >
              {recording ? "Recording..." : "Record"}
            </button>
            <p className="record__description">Record a first track!</p>
          </div>
          <Tracklist />
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
