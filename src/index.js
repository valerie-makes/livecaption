const express = require("express");
const translate = require("@vitalets/google-translate-api");

const app = express();
const win = nw.Window.get();

const captions = document.getElementById("captions");
const en = document.querySelector("#captions [lang=en]");
const de = document.querySelector("#captions [lang=de]");

app.get("/caption/:text", async (req, res) => {
  const { text } = req.params;
  const result = await translate(text, { to: "de" });

  en.textContent = text;
  de.textContent = result.text;
  win.height = captions.scrollHeight + 16;

  res.send();
});

app.listen(3000);
