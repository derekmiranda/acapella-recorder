import { Component } from "react";
import TickWorker from "worker-loader!../lib/TickWorker.ts"; // eslint-disable-line import/no-webpack-loader-syntax

export interface MetronomeProps {
  tempo: number;
}

const BEEP_LENGTH = 0.05;

interface MetronomeState {
  lookAhead: number; // time frame to schedule beats within (in ms)
  scheduleAheadTime: number; // How far ahead to schedule audio (sec)
  nextNoteTime: number; // when the next note is due.
  currentNote: number; // note number in current measure (measured in quarter notes)
}

class Metronome extends Component<MetronomeProps, MetronomeState> {
  private tickWorker: TickWorker;
  private audioContext: AudioContext;

  constructor(props: MetronomeProps) {
    super(props);
    this.tickWorker = new TickWorker();
    console.log("New metronome");
    this.audioContext = new AudioContext();
    this.state = {
      lookAhead: 25.0,
      scheduleAheadTime: 0.1,
      nextNoteTime: 0.0,
      currentNote: 0,
    };

    this.initAudioContext();
  }

  scheduleNote(time: number) {
    const osc = this.audioContext.createOscillator();
    osc.connect(this.audioContext.destination);
    osc.frequency.value = 440.0;

    osc.start(time);
    osc.stop(time + BEEP_LENGTH);
  }

  // advance current (quarter) note
  nextNote() {
    const { currentNote, nextNoteTime } = this.state;
    const { tempo } = this.props;
    const secondsPerBeat = 60.0 / tempo;

    let newNote = currentNote + 1; // Advance the beat number, wrap to zero
    if (newNote === 4) {
      newNote = 0;
    }

    this.setState({
      nextNoteTime: nextNoteTime + secondsPerBeat,
      currentNote: newNote,
    });
  }

  schedule() {
    const { nextNoteTime, scheduleAheadTime } = this.state;
    const { tempo } = this.props;

    const scheduleTime = this.audioContext.currentTime + scheduleAheadTime;
    if (nextNoteTime < scheduleTime) {
      // schedule enough notes to fit in schedule time
      const beatTime = tempo / 60;
      const schedules = Math.ceil((scheduleTime - nextNoteTime) / beatTime);
      for (let i = 0; i < schedules; i++) {
        this.scheduleNote(nextNoteTime);
        this.nextNote();
      }
    }
  }

  initAudioContext() {
    const { lookAhead } = this.state;

    this.tickWorker.onmessage = (e) => {
      if (e.data === "tick") {
        this.schedule();
      }
    };

    this.tickWorker.postMessage({ interval: lookAhead });

    // play silent buffer to unlock the audio
    var buffer = this.audioContext.createBuffer(1, 1, 22050);
    var node = this.audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
  }

  componentDidMount() {
    this.tickWorker.postMessage("start");

    this.setState({
      nextNoteTime: this.audioContext.currentTime,
    });
  }

  componentWillUnmount() {
    this.tickWorker.postMessage("stop");
    this.tickWorker.terminate();
  }

  render() {
    return <></>;
  }
}

export default Metronome;
