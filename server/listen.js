const server = require("./server");

server.app.listen(server.port, () =>
  console.log(`we got a real one on ${server.port}, folks`)
);
