import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const app = express();
const PORT = 5000;

app.use(express.static(__dirname));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
