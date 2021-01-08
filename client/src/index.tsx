import React from "react";
import ReactDOM from "react-dom";
import "./styles/styles.scss";
import App from "./components/App";
import { RecorderProvider } from "./components/RecorderStateProvider";
import reportWebVitals from "./reportWebVitals";
import LoopRecorder from "./lib/LoopRecorder";

const recorder = new LoopRecorder();

ReactDOM.render(
  <React.StrictMode>
    <RecorderProvider>
      <App recorder={recorder} />
    </RecorderProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
