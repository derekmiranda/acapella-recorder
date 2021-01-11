import { createIdGetter } from "./utils";

class PlaybackManager {
  audioEls: {
    [id: string]: HTMLAudioElement;
  } = {};
  getNewId: () => number = createIdGetter();

  play() {
    for (let audioEl of Object.values(this.audioEls)) {
      audioEl.play();
    }
  }

  // seek to audio element time, in terms of seconds
  seek(time: number) {
    for (let audioEl of Object.values(this.audioEls)) {
      audioEl.currentTime = time;
    }
  }

  remove(id: number) {
    delete this.audioEls[id];
  }

  addAudio(audioEl: HTMLAudioElement): number {
    const id = this.getNewId();
    this.audioEls[id] = audioEl;
    return id;
  }
}

export default PlaybackManager;
