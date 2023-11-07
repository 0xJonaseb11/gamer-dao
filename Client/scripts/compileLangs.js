const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const secret = require('../translation-key.json');

require('dotenv').config();

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADS_SHEET_KEY);

const read = async () => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle.Sheet1;
  await sheet.loadHeaderRow();
  const colTitles = sheet.headerValues;
  const rows = await sheet.getRows({ limit: sheet.rowCount });
  let result = {};
  rows.forEach((row) => {
    colTitles.slice(1).forEach((title) => {
      result[title] = result[title] || [];
      const key = row[colTitles[0]];
      result = {
        ...result,
        [title]: {
          ...result[title],
          [key]: row[title] !== '' ? row[title] : undefined,
        },
      };
    });
  });
  return result;
};

const write = (data) => {
  Object.keys(data).forEach((key) => {
    fs.writeFile(`src/locales/${key}.json`, JSON.stringify(data[key], null, 2), (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};

const init = async () => {
  await doc.useServiceAccountAuth({
    client_email: secret.client_email,
    private_key: secret.private_key,
  });
};

init()
  .then(() => read())
  .then((data) => write(data))
  .catch((err) => console.error('ERROR!!!!', err));
