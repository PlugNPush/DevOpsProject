const app = require("./app.js");
const port = 443;
app.default.listen(port, () => {
  console.log(`Serveur actif sur le port ${port}`);
});

