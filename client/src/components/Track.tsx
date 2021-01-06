export interface TrackProps {
  url: string;
}

function Track({ url }: TrackProps) {
  return (
    <div className="track">
      <audio controls src={url} />
    </div>
  );
}

export default Track;
