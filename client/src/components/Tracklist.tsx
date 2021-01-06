import Track from "./Track";
import TrackPlaceholder from "./TrackPlaceholder";

function Tracklist() {
  // keep track of loop blob URLs
  const trackURLs: string[] = [];

  return (
    <div className="tracklist">
      <div className="tracklist__content">
        {trackURLs.length ? (
          trackURLs.map((trackURL) => <Track url={trackURL} />)
        ) : (
          <TrackPlaceholder />
        )}
      </div>
    </div>
  );
}

export default Tracklist;
