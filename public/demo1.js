import WebSocket from "ws";

let ws;

ws = new WebSocket("wss://stream.bybit.com/spot/public/v3");

ws.on("open", () => {
  console.log("WS OPEN");
});
