export interface LoopRecorderArgs {
  stream: MediaStream;
}

class LoopRecorder {
  private _chunks: Blob[] = [];
  private _recorder: MediaRecorder;

  constructor({ stream }: LoopRecorderArgs) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this._recorder = new MediaRecorder(stream);
    } else {
      throw new Error(
        "LoopRecorder requires the use of the getUserMedia API. Please use a compatible browser."
      );
    }
  }

  init() {
    this._recorder.ondataavailable = (event) => {
      this._chunks.push(event.data);
    };
  }

  startRecording() {
    this._recorder.start();
  }

  flushRecording(): string {
    this._recorder.stop();
    const blob = new Blob(this._chunks, { type: "audio/ogg; codecs=opus" });
    this._chunks = [];
    return window.URL.createObjectURL(blob);
  }
}

export { LoopRecorder };
