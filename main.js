import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, PORT = 3000 } = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error("SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET 필요");
  process.exit(1);
}

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const basic = Buffer
  .from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
  .toString("base64");

app.get("/spotify/token", async (req, res) => {
  try {
    const body = new URLSearchParams({ grant_type: "client_credentials" });
    const r = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!r.ok) {
      const err = await r.text();
      return res.status(500).json({ error: "spotify_token_error", detail: err });
    }
    const data = await r.json(); 
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "server_error", detail: String(e) });
  }
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
