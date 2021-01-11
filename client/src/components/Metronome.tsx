import { RefObject, useEffect, useRef } from "react";

export interface MetronomeProps {
  active: boolean;
  tempo: number;
}

function Metronome({ active, tempo }: MetronomeProps) {
  const audioRef: RefObject<HTMLAudioElement> = useRef(null);

  useEffect(() => {
    let intervalId: number;
    if (active && audioRef.current) {
      const audioEl = audioRef.current;
      intervalId = window.setInterval(() => {
        audioEl.currentTime = 0;
        audioEl.play();
      }, 1000 / (tempo / 60)); // 120 bpm = 2 bps =
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
