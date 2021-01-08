import { ChangeEvent } from "react";
import {
  RecorderActionType,
  Track,
  TrackAction,
  useRecorderDispatch,
} from "./RecorderStateProvider";

export interface TrackProps {
  track: Track;
}

function Trackbar({ track }: TrackProps) {
  const dispatch = useRecorderDispatch();
  const { name, url, id } = track;

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
      <audio controls src={url} />
      <button onClick={handleRemove}>Delete</button>
    </div>
  );
}

export default Trackbar;
