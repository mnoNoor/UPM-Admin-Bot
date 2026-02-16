const wordsData = require("./wordsData.json");

const allowedNumbers = new Set(wordsData.allowedNumbers.map((n) => String(n)));

const isAllowedNumber = (text) => {};

module.exports = { isAllowedNumber };
