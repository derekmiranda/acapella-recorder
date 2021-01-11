import { RefObject, useEffect, useRef } from "react";

export interface MetronomeProps {
  active: boolean;
  tempo: number;
}

function play(audioEl: HTMLAudioElement) {
  audioEl.currentTime = 0;
  audioEl.play();
}

function Metronome({ active, tempo }: MetronomeProps) {
  const audioRef: RefObject<HTMLAudioElement> = useRef(null);

  useEffect(() => {
    let intervalId: number;
    if (active && audioRef.current) {
      const audioEl = audioRef.current;
      play(audioEl);
      intervalId = window.setInterval(() => {
        play(audioEl);
      }, 1000 / (tempo / 60));
    }

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [active, tempo]);

  return <audio ref={audioRef} src="./assets/metronome.wav" />;
}

export default Metronome;
