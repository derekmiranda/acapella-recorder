import { RefObject, useEffect, useRef } from "react";

export interface MetronomeProps {
  active: boolean;
  tempo: number;
}

function play(
  audioEl: HTMLAudioElement,
  state: {
    tempo: number;
    shouldPlay: boolean;
  }
): Promise<void> {
  audioEl.currentTime = 0;
  if (state.shouldPlay) {
    audioEl.play().then(() => {
      setTimeout(() => {
        play(audioEl, state);
      }, (60 * 1000) / state.tempo);
    });
  }
  return Promise.resolve();
}

function Metronome({ active, tempo }: MetronomeProps) {
  const audioRef: RefObject<HTMLAudioElement> = useRef(null);

  useEffect(() => {
    const intervalState = {
      tempo,
      shouldPlay: true,
    };

    if (tempo && active && audioRef.current) {
      const audioEl = audioRef.current;
      play(audioEl, intervalState);
    }

    return () => {
      intervalState.shouldPlay = false;
    };
  }, [active, tempo]);

  return <audio ref={audioRef} src="./assets/metronome.wav" preload="auto" />;
}

export default Metronome;
