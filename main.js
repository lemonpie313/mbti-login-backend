import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const USERNAME = process.env.LOGIN_ID;
const PASSWORD = process.env.LOGIN_PW;
const SECRET_KEY = process.env.JWT_SECRET || "temp_secret";

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

app.listen(PORT, () => {
  console.log(`Server running`);
});
