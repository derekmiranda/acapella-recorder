import { Track } from "./RecorderStateProvider";
import Trackbar from "./Trackbar";
import TrackPlaceholder from "./TrackPlaceholder";

export interface TracklistProps {
  tracks: Track[];
}

function Tracklist({ tracks }: TracklistProps) {
  return (
    <div className="tracklist">
      <div className="tracklist__content">
        {tracks.length ? (
          tracks.map((track, i) => <Trackbar track={track} key={i} />)
        ) : (
          <TrackPlaceholder />
        )}
      </div>
    </div>
  );
}

export default Tracklist;
