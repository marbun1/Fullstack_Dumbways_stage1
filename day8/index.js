const express = require("express");
const app = express();

app.get("/", (req, tes) => {
  tes.send("Hello World ");
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
