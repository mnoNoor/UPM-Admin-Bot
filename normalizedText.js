const { stripSmall, stripTatweel } = require("arajs");

const tashkeel = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const punctuation = /[.,$…!?؛،:"'()\[\]{}<>@#%^&*_+=\\\/|-]/g;

const normalize = (text = "") => {
  return stripSmall(
    stripTatweel(
      text.replace(tashkeel, "").replace(punctuation, " ").replace(/\s+/g, " "),
    ),
  )
    .toLowerCase()
    .trim();
};

module.exports = { normalize };
