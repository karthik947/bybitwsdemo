import WebSocket from "ws";
import { promisify } from "util";

const delay = promisify(setTimeout);
const PING_INTERVAL = 20 * 1000;
const HEARTBEAT_INTERVAL = 25 * 1000;
let pingTrigger;
let heartbeatTrigger;
let ws;
let subs = [];

// MAIN FUNCTIONS
function restart() {
  if (ws) ws.terminate();

  ws = new WebSocket("wss://stream.bybit.com/spot/public/v3");
  ws.on("open", onOpen);
  ws.on("message", onMessage);
  ws.on("error", onError);
  ws.on("pong", onPong);

  clearInterval(pingTrigger);
  pingTrigger = setInterval(() => {
    if (!(ws.readyState === WebSocket.OPEN)) return;
    ws.ping();
  }, PING_INTERVAL);
}

function subscribe(topics) {
  // topics = []
  subs = topics;
  if (!(ws.readyState === WebSocket.OPEN)) return;
  ws.send(JSON.stringify({ op: "subscribe", args: topics }));
}

function unsubscribe(topics) {
  // topics = []
  subs = subs.filter((d) => !topics.include(d));
  if (!(ws.readyState === WebSocket.OPEN)) return;
  ws.send(JSON.stringify({ op: "unsubscribe", args: topics }));
}

// CONTROL FRAMES
const onOpen = () => {
  console.log("WS OPEN");
  if (!(ws.readyState === WebSocket.OPEN)) return;
  ws.send(JSON.stringify({ op: "subscribe", args: subs }));
};

const onPong = () => {
  console.log("WS PONG RECEIVED!");
  clearTimeout(heartbeatTrigger);

  heartbeatTrigger = setTimeout(() => {
    console.log("HEARTBEAT TRIGGERED");
    restart();
  }, HEARTBEAT_INTERVAL);
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
})();
