const fs = require("fs");
const readline = require("readline");

const rootDir = `${__dirname}/..`;
const inputDir = `${rootDir}/data/input`;
const outputOfPpiResilienceDir = `${inputDir}/outputOfPpiResilience`;
const outputDir = `${rootDir}/data/output`;
const overviewDir = `${outputDir}/overview`;
const jobListPath = `${inputDir}/jobList.txt`;

function getEntropies(speciesId) {
  const randomDir = `${outputOfPpiResilienceDir}/${speciesId}/entropies/random`;
  const betweennessPath = `${outputOfPpiResilienceDir}/${speciesId}/entropies/betweenness`;
  const closenessPath = `${outputOfPpiResilienceDir}/${speciesId}/entropies/closeness`;
  const degreecentralityPath = `${outputOfPpiResilienceDir}/${speciesId}/entropies/degreecentrality`;

  let randomEntropies = new Array(101).fill(0.0);
  let betweennessEntropies = [];
  let closenessEntropies = [];
  let degreecentralityEntropies = [];

  for (let i = 0; i < 1000; i++) {
    let randoms = fs
      .readFileSync(`${randomDir}/random_${i}`)
      .toString()
      .split("\n")
      .slice(0, -1);
    randoms.forEach((item, index) => {
      randomEntropies[index] += parseFloat(item) / 1000;
    });
  }

  randomEntropies.forEach((item, index) => {
    randomEntropies[index] = parseFloat(item.toFixed(5));
  });

  betweennessEntropies = fs
    .readFileSync(betweennessPath)
    .toString()
    .split("\n")
    .slice(0, -1)
    .map((item) => parseFloat(parseFloat(item).toFixed(5)));
  closenessEntropies = fs
    .readFileSync(closenessPath)
    .toString()
    .split("\n")
    .slice(0, -1)
    .map((item) => parseFloat(parseFloat(item).toFixed(5)));
  degreecentralityEntropies = fs
    .readFileSync(degreecentralityPath)
    .toString()
    .slice(0, -1)
    .split("\n")
    .map((item) => parseFloat(parseFloat(item).toFixed(5)));

  return {
    randomEntropies,
    betweennessEntropies,
    closenessEntropies,
    degreecentralityEntropies,
  };
}

async function getSpeciesIds(fReadName) {
  return new Promise((resolve, reject) => {
    var fRead = fs.createReadStream(fReadName);
    var objReadline = readline.createInterface({ input: fRead });
    var arr = new Array();
    objReadline.on("line", function (line) {
      arr.push(line);
    });
    objReadline.on("close", function () {
      resolve(arr);
    });
  });
}

async function main() {
  let speciesIds = await getSpeciesIds(jobListPath);
  let jobNum = speciesIds.length;

  console.log("# Start...");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  if (!fs.existsSync(overviewDir)) {
    fs.mkdirSync(overviewDir);
  }

  for (let i = 0; i < jobNum; i++) {
    console.log(`# (${i + 1}/${jobNum}) ID: ${speciesIds[i]}`);

    if (!fs.existsSync(`${outputDir}/${speciesIds[i]}`)) {
      fs.mkdirSync(`${outputDir}/${speciesIds[i]}`);
    }

    let entropies = getEntropies(speciesIds[i]);
    let entropiesPath = `${outputDir}/${speciesIds[i]}/entropies.json`;
    fs.writeFileSync(entropiesPath, JSON.stringify(entropies));
  }
  console.log("# Finished.");
}

// 程序入口
main();
