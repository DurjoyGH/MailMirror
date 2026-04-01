require("dotenv").config();
require("colors");

const app = require("./app");

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
  console.log("====================================".rainbow);
  console.log(`🚀 Server running on port ${PORT}`.green.bold);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`.cyan);
  console.log("====================================".rainbow);
});