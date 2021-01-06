import Track from "./Track";
import TrackPlaceholder from "./TrackPlaceholder";

export interface TracklistProps {
  tracks: string[];
}

function Tracklist({ tracks }: TracklistProps) {
  return (
    <div className="tracklist">
      <div className="tracklist__content">
        {tracks.length ? (
          tracks.map((track, i) => <Track url={track} key={i} />)
        ) : (
          <TrackPlaceholder />
        )}
      </div>
    </div>
  );
}

export default Tracklist;
