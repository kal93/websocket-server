import WebSocket from "ws";
// import queryString from "query-string";

export default (expressServer) => {
  const webSocketServer = new WebSocket.Server({
    noServer: true,
    path: "/websockets",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    webSocketServer.handleUpgrade(request, socket, head, (websocket) => {
      webSocketServer.emit("connection", websocket, request);
    });
  });

  webSocketServer.on(
    "connection",
    function connection(websocketConnection, connectionRequest) {
      const [_path, params] = connectionRequest?.url?.split("?");
      // const connectionParams = queryString.parse(params);

      // NOTE: connectParams are not used here but good to understand how to get
      // to them if you need to pass data with the connection to identify it (e.g., a userId).
      console.log(params);

      websocketConnection.on("message", (message) => {
        console.log(message.toString());
        webSocketServer.clients.forEach((client) => {
          const parsedMessage = JSON.stringify(message.toString());
          console.log(parsedMessage, "parsedMessage");
          // console.log(JSON.stringify(client), "Client");
          if (client.readyState === WebSocket.OPEN) {
            console.log("[CONNECTED]");
          }
          if (
            client.readyState === WebSocket.CLOSED ||
            client.readyState === WebSocket.CLOSING
          ) {
            console.log("[CONNECTION CLOSED]");
          }
        });

        websocketConnection.on("close", (e) => {
          console.log("Connection was closed by client", e);
        });

        setInterval(() => {
          websocketConnection?.send(
            JSON.stringify({
              message: "There be gold in them thar hills.",
              id: Math.random(),
            })
          );
        }, 5000);
      });

      // setInterval(() => {
      //   websocketConnection?.send(
      //     JSON.stringify({
      //       message: "There be gold in them thar hills.",
      //       id: Math.random(),
      //       connectionRequest: connectionRequest,
      //     })
      //   );
      // }, 5000);
    }
  );

  // End and return, add websocket routes above this
  return webSocketServer;
};

const sendEvery5Seconds = (websocketConnection) => {
  websocketConnection?.send(
    JSON.stringify({
      message: "There be gold in them thar hills.",
      id: Math.random(),
    })
  );

  setTimeout(sendEvery5Seconds, 5000);
};
