import { ChangeEvent, useEffect } from "react";
import {
  PlaybackActionType,
  usePlaybackDispatch,
  usePlaybackManager,
  usePlaybackState,
} from "../providers/PlaybackProvider";
import {
  RecorderActionType,
  startRecording,
  stopRecording,
  useRecorderDispatch,
  useRecorderState,
  useRecorder,
  SettingsAction,
} from "../providers/RecorderProvider";
import Metronome from "./Metronome";
import Tracklist from "./Tracklist";

function App() {
  const {
    recordingAvailable,
    isRecording,
    initializingRecord,
    tracks,
    playWhileRecording,
    useMetronome,
    metronomeTempo: tempo,
    testingMetronome,
  } = useRecorderState();
  const recorderDispatch = useRecorderDispatch();
  const recorder = useRecorder();

  const { playing } = usePlaybackState();
  const playbackDispatch = usePlaybackDispatch();
  const playbackManager = usePlaybackManager();

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    recorderDispatch({ type: RecorderActionType.recordingUnavailable });
  }

  useEffect(() => {
    if (playing) {
      playbackManager.play();
    } else {
      playbackManager.pause();
    }
  }, [playing, playbackManager]);

  // recording handlers
  const onStartRecord = () => {
    startRecording({
      recorderDispatch,
      playbackDispatch,
      testingMetronome,
      recorder,
      playWhileRecording,
    });
  };

  const onStopRecord = () => {
    stopRecording(recorderDispatch, recorder);
    if (playWhileRecording) {
      playbackDispatch({
        type: PlaybackActionType.stop,
      });
    }
  };

  // settings handlers
  const onMetronomeToggle = () => {
    recorderDispatch({
      type: RecorderActionType.toggleMetronome,
    });
  };

  const onMetronomeTempoUpdate = (tempo: number) => {
    recorderDispatch({
      type: RecorderActionType.updateMetronomeTempo,
      metronomeTempo: tempo,
    } as SettingsAction);
  };

  const onTestMetronome = () => {
    recorderDispatch({
      type: RecorderActionType.toggleTestingMetronome,
    });
  };

  // playback handlers
  const onPlay = () => {
    playbackDispatch({
      type: PlaybackActionType.play,
    });
  };

  const onPause = () => {
    playbackDispatch({
      type: PlaybackActionType.pause,
    });
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
            <div className="record__option-container">
              <input
                type="checkbox"
                id="metronome__toggle"
                checked={useMetronome}
                onChange={onMetronomeToggle}
              />
              <label htmlFor="metronome__toggle">Use metronome?</label>
              <input
                id="metronome__tempo-input"
                className="metronome__tempo-input"
                value={tempo}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  let tempo = parseInt(event.target.value);
                  onMetronomeTempoUpdate(tempo);
                }}
              ></input>
              <label
                htmlFor="metronome__tempo-input"
                className="metronome__tempo-input-label"
              >
                {" "}
                bpm
              </label>
              <button onClick={onTestMetronome}>
                {testingMetronome ? "Stop Test" : "Test"}
              </button>
            </div>
            <Metronome
              active={(isRecording || testingMetronome) && useMetronome}
              tempo={tempo}
            />
          </div>
          <div className="playback">
            <button onClick={playing ? onPause : onPlay}>
              {playing ? "Pause All" : "Play All"}
            </button>
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
