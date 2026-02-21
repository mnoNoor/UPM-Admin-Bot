const { stripSmall, stripTatweel } = require("arajs");

const tashkeel = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const punctuation = /[.,$…!?؛،:"'()\[\]{}<>@#%^&*_+=\\\/|-]/g;
const invisible = /[\u200B-\u200F\u202A-\u202E\u2060\uFE0E\uFE0F]/g;

const normalize = (text) => {
  return stripSmall(
    stripTatweel(
      text
        .replace(tashkeel, "")
        .replace(invisible, "")
        .replace(punctuation, ""),
    ),
  )
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
};

module.exports = { normalize };
