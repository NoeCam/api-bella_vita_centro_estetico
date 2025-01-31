import "dotenv/config";
import server from "./src/server.js";

const PORT = process.env.PORT || 3224;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
