const fs = require("fs");

const rootDir = `${__dirname}/..`;
const outputDir = `${rootDir}/data/output`;

function isComputedLayout (speciesId) {
  let layoutPath = `${outputDir}/${speciesId}/layout`;
  if (fs.existsSync(layoutPath)) {
    return true
  } else {
    return false
  }
}

exports.isComputedLayout = isComputedLayout;
