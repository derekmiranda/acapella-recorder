class LoopRecorder {
  private _chunks: Blob[] = [];
  private _recorder: MediaRecorder | undefined;

  constructor() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        "LoopRecorder requires the use of the getUserMedia API. Please use a compatible browser."
      );
    }
  }

  // returns promise resolving to blob URL and recorder id
  startRecording(): Promise<void> {
    return navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this._recorder = new MediaRecorder(stream);
        this._recorder.ondataavailable = (event) => {
          this._chunks.push(event.data);
        };
        this._recorder.onerror = (event) => {
          throw event.error;
        };
        this._recorder.start();
      })
      .catch((error) => {
        console.error("LoopRecorder encountered an error");
        throw error;
      });
  }

  flushRecording(): Promise<string> {
    if (!this._recorder) return Promise.resolve("");

    const recorder: MediaRecorder = this._recorder;

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(this._chunks, { type: "audio/ogg; codecs=opus" });
        this._chunks = [];
        this._recorder = undefined;
        resolve(window.URL.createObjectURL(blob));
      };

      recorder.stop();
    });
  }
}

export default LoopRecorder;
