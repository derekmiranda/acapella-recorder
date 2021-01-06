import "./App.scss";

function App() {
  return (
    <div className="app">
      <h1 className="app__header">Acapella Recorder</h1>
      <div className="recorder">
        <button>Record</button>
        <p className="recorder__description">Record a first track!</p>
      </div>
    </div>
  );
}

export default App;
