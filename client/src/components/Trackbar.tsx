import { ChangeEvent, RefObject, useEffect, useRef, useState } from "react";
import {
  RecorderActionType,
  Track,
  TrackAction,
  useRecorderDispatch,
} from "../providers/RecorderStateProvider";

export interface TrackProps {
  track: Track;
}

function Trackbar({ track }: TrackProps) {
  const dispatch = useRecorderDispatch();
  const { name, url, id } = track;
  const [playing, updatePlaying] = useState(false);
  const audioRef: RefObject<HTMLAudioElement> = useRef(null);

  const handlePlay = () => {
    updatePlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      const audioEl = audioRef.current;

      audioEl.addEventListener("ended", () => {
        updatePlaying(false);
      });

      if (playing) {
        audioEl.play();
      }
    }
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: RecorderActionType.renameTrack,
      name: event.target.value as string,
      id,
    } as TrackAction);
  };

  const handleRemove = () => {
    dispatch({
      type: RecorderActionType.removeTrack,
      id,
    } as TrackAction);
  };

  return (
    <div className="track">
      <input value={name} onChange={handleChange} />
      <audio ref={audioRef} controls src={url} />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleRemove}>Delete</button>
    </div>
  );
}

export default Trackbar;
