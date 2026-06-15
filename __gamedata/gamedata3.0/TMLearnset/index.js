const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const tmLearnset = {};

files.forEach(file => {
  const m = file.match(/^monsno_(\d+)_formno_(\d+)\.json$/);
  if (!m) return;
  const monsno = m[1];
  const formno = Number(m[2]);
  const content = require(path.join(dir, file));

  if (!tmLearnset[monsno]) tmLearnset[monsno] = [];
  tmLearnset[monsno][formno] = content;
});

module.exports = tmLearnset;
