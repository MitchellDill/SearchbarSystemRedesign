const { app } = require("./server");

const port = 3002;

app.listen(port, () => console.log(`we got a real one on ${port}, folks`));
