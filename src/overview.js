const fs = require("fs");
const readline = require("readline");
const allEvolution = require("./readTsv").getAllEvolution();

const rootDir = `${__dirname}/..`;
const inputDir = `${rootDir}/data/input`;
const outputOfPpiResilienceDir = `${inputDir}/outputOfPpiResilience`;
const outputDir = `${rootDir}/data/output`;
const overviewDir = `${outputDir}/overview`;
const evoResiPath = `${overviewDir}/evoResi.json`;
const jobListPath = `${inputDir}/jobList.txt`;

function getEvoResi() {
  let Archaea = [];
  let Bacteria = [];
  let Eukaryota = [];
  allEvolution.forEach((item) => {
    if (item["Species_ID"] != "") {
      const resiliencePath = `${outputOfPpiResilienceDir}/${item["Species_ID"]}/resilience`;
      const resilience = fs.readFileSync(resiliencePath);
      const randomResilience = resilience.toString().split("\n")[0];
      const dataUnit = [parseFloat(item["Evolution"]), parseFloat(randomResilience), item["Species_ID"]];
      switch (item["Domain"]) {
        case "Archaea":
          Archaea.push(dataUnit);
          break;
        case "Bacteria":
          Bacteria.push(dataUnit);
          break;
        case "Eukaryota":
          Eukaryota.push(dataUnit);
          break;
        default:
          console.log("Domain not matched!");
      }
    }
  });
  return {Archaea, Bacteria, Eukaryota};
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
  // let speciesIds = await getSpeciesIds(jobListPath);
  // let jobNum = speciesIds.length;

  console.log("# Start...");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  if (!fs.existsSync(overviewDir)) {
    fs.mkdirSync(overviewDir);
  }

  console.log("# EvoResi...");

  fs.writeFileSync(evoResiPath, JSON.stringify(getEvoResi()));

  // for (let i = 0; i < jobNum; i++) {
  //   console.log(`# (${i + 1}/${jobNum}) ID: ${speciesIds[i]}`);
  // }
  console.log("# Finished.");
}

// 程序入口
main();
