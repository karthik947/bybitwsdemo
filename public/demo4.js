import WebSocket from "ws";
import { promisify } from "util";

const delay = promisify(setTimeout);
let ws;

// MAIN FUNCTIONS
function restart() {
  if (ws) ws.terminate();

  ws = new WebSocket("wss://stream.bybit.com/spot/public/v3");
  ws.on("open", onOpen);
  ws.on("message", onMessage);
  ws.on("error", onError);
}

function subscribe(topics) {
  // topics = []
  if (!(ws.readyState === WebSocket.OPEN)) return;
  ws.send(JSON.stringify({ op: "subscribe", args: topics }));
}

function unsubscribe(topics) {
  // topics = []
  if (!(ws.readyState === WebSocket.OPEN)) return;
  ws.send(JSON.stringify({ op: "unsubscribe", args: topics }));
}

// CONTROL FRAMES
const onOpen = () => {
  console.log("WS OPEN");
};

const onMessage = (pl) => {
  console.log(pl.toString());
};

const onError = async (err) => {
  console.error(err);
  await delay(5000);
  restart();
};

// CORE LOGIC
(async () => {
  restart();
  await delay(1000);
  subscribe(["kline.30m.BTCUSDT", "kline.12h.XRPUSDT"]);
  await delay(5000);
  unsubscribe(["kline.12h.XRPUSDT"]);
})();
