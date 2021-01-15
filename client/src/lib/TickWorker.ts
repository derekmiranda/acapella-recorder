let timerID: number | undefined;
let interval = 100;

declare var self: any;

self.onmessage = function (e: MessageEvent<any>) {
  if (e.data === "start") {
    timerID = self.setInterval(function () {
      postMessage("tick");
    }, interval);
  } else if (e.data.interval) {
    interval = e.data.interval;
    if (timerID) {
      clearInterval(timerID);
      timerID = self.setInterval(function () {
        postMessage("tick");
      }, interval);
    }
  } else if (e.data === "stop") {
    clearInterval(timerID);
    timerID = undefined;
  }
};

export {};
