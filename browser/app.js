import express from "express";
import { Server } from "socket.io";

import bybitws from "./utils/bybitws.js";
import { delay } from "./utils/helper.js";

// CORE LOGIC
(async () => {
  const app = express();
  const server = app.listen(5000, () =>
    console.log("App started on port 5000")
  );

  const io = new Server(server, { cors: { origin: "*" } });

  bybitws.ee.on("WSDATA", (pl) => {
    io.emit("WSDATA", pl);
  });

  bybitws.restart();
  await delay(1000);
  bybitws.subscribe(["kline.30m.BTCUSDT"]);
})();
