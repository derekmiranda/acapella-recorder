class PlaybackManager {
  audioEls: HTMLAudioElement[] = [];

  play() {
    for (let audioEl of this.audioEls) {
      audioEl.play();
    }
  }

  addAudio(audioEl: HTMLAudioElement) {
    this.audioEls.push(audioEl);
  }
}

export default PlaybackManager;
