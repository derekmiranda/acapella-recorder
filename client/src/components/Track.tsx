export interface TrackProps {
  url: string;
}

function Track({ url }: TrackProps) {
  return <div className="track">{url}</div>;
}

export default Track;
