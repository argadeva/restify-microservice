require("dotenv").config();
const Server = require("./src/app/server");
const appServer = new Server();

const port = process.env.PORT || 8000;

appServer.server.listen(port, () => {
  console.log(
    `${appServer.server.name} started, listening at ${appServer.server.url}`,
  );
});
