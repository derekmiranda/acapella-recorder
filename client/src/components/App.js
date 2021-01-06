import { useState } from "react";

function App() {
  const [recording, updateRecording] = useState(false);

  const toggleRecording = () => {
    updateRecording(!recording);
  };

  return (
    <div className="app">
      <h1 className="app__header">Acapella Recorder</h1>
      <div className="record">
        <button className="record__btn" onClick={toggleRecording}>
          {recording ? "Recording..." : "Record"}
        </button>
        <p className="record__description">Record a first track!</p>
      </div>
    </div>
  );
}

export default App;
