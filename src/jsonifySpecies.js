const fs = require("fs");
const readline = require("readline");
const speciesBasic = require("./readTsv").getSpeciesBasicObj();

const rootDir                  = `${__dirname}/..`;
const inputDir                 = `${rootDir}/data/input`;
const outputDir                = `${rootDir}/data/output`;
const jobListPath              = `${inputDir}/jobList.txt`;
const outputOfLifeTreeDir      = `${inputDir}/outputOfLifeTree`;
const outputOfPpiResilienceDir = `${inputDir}/outputOfPpiResilience`;
const speciesBasicInfoDir      = `${inputDir}/speciesBasicInfo`;
const betweennessDir           = `${outputOfLifeTreeDir}/betweenness`;
const closenessDir             = `${outputOfLifeTreeDir}/closeness`;
const clusteringDir            = `${outputOfLifeTreeDir}/clustering`;
const curvatureDir             = `${outputOfLifeTreeDir}/curvature`;
const degreecentralityDir      = `${outputOfLifeTreeDir}/degreecentrality`;
const degreesDir               = `${outputOfLifeTreeDir}/degrees`;
const kcoresDir                = `${outputOfLifeTreeDir}/kcores`;
const lorenzDir                = `${outputOfLifeTreeDir}/lorenz`;
const orcaDir                  = `${outputOfLifeTreeDir}/orca-statistics`;
const statisticsDir            = `${outputOfLifeTreeDir}/statistics`;
const taxonomiesDir            = `${speciesBasicInfoDir}/taxonomies`;

function getSpeciesBetweenness(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${betweennessDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    let obj = {};
    objReadline.on("line", function (line) {
      let lineSplit = line.split(" ");
      obj[lineSplit[0]] = parseFloat(lineSplit[1]);
    });
    objReadline.on("close", function () {
      resolve(obj);
    });
  });
}

function getSpeciesCloseness(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${closenessDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    let obj = {};
    objReadline.on("line", function (line) {
      let lineSplit = line.split(" ");
      obj[lineSplit[0]] = parseFloat(lineSplit[1]);
    });
    objReadline.on("close", function () {
      resolve(obj);
    });
  });
}

function getSpeciesClustering(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${clusteringDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    let obj = {};
    objReadline.on("line", function (line) {
      let lineSplit = line.split(" ");
      obj[lineSplit[0]] = parseFloat(lineSplit[1]);
    });
    objReadline.on("close", function () {
      resolve(obj);
    });
  });
}

function getSpeciesCurvature(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${curvatureDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    let obj = {};
    objReadline.on("line", function (line) {
      let lineSplit = line.split(" ");
      obj[lineSplit[0]] = parseFloat(lineSplit[1]);
    });
    objReadline.on("close", function () {
      resolve(obj);
    });
  });
}

function getSpeciesDegreecentrality(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${degreecentralityDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    let obj = {};
    objReadline.on("line", function (line) {
      let lineSplit = line.split(" ");
      obj[lineSplit[0]] = parseFloat(lineSplit[1]);
    });
    objReadline.on("close", function () {
      resolve(obj);
    });
  });
}

function getSpeciesOrca(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${orcaDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    let obj = {};
    objReadline.on("line", function (line) {
      let lineSplit = line.split(" ");
      let orcaCounts = lineSplit.slice(1);
      orcaCounts.forEach(
        (orcaCount, index) => (orcaCounts[index] = parseInt(orcaCount))
      );
      obj[lineSplit[0]] = orcaCounts;
    });
    objReadline.on("close", function () {
      resolve(obj);
    });
  });
}

function getSpeciesTaxonomies(speciesId) {
  const filePath = `${taxonomiesDir}/${speciesId}.txt`;
  let levelsStr = fs.readFileSync(filePath).toString();
  var arr = [];
  levelsStr.split("; ").forEach((level) => {
    arr.push(level);
  });
  return arr;
}

function getSpeciesResilience(speciesId) {
  const filePath = `${outputOfPpiResilienceDir}/${speciesId}/resilience`;
  let resilienceStr = fs.readFileSync(filePath).toString();
  let fourResilience = resilienceStr.split("\n");
  let resilienceObj = {
    random: parseFloat(fourResilience[0]),
    betweenness: parseFloat(fourResilience[1]),
    closeness: parseFloat(fourResilience[2]),
    degreecentrality: parseFloat(fourResilience[3])
  }
  return resilienceObj;
}

function getSpeciesDegrees(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${degreesDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    var arr = new Array();
    objReadline.on("line", function (line) {
      let obj = {};
      let lineSplit = line.split(" ");
      obj["degree"] = parseInt(lineSplit[0]);
      obj["count"] = parseInt(lineSplit[1]);
      arr.push(obj);
    });
    objReadline.on("close", function () {
      resolve(arr);
    });
  });
}

function getSpeciesKcores(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${kcoresDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    var arr = new Array();
    objReadline.on("line", function (line) {
      let obj = {};
      let lineSplit = line.split(" ");
      obj["k"]        = parseInt(lineSplit[0]);
      obj["nodesNum"] = parseInt(lineSplit[1]);
      obj["edgesNum"] = parseInt(lineSplit[2]);
      arr.push(obj);
    });
    objReadline.on("close", function () {
      resolve(arr);
    });
  });
}

function getSpeciesLorenz(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${lorenzDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    var arr = new Array();
    objReadline.on("line", function (line) {
      let obj = {};
      let lineSplit = line.split(" ");
      obj["x%"] = parseFloat(lineSplit[0]);
      obj["y%"] = parseFloat(lineSplit[1]);
      arr.push(obj);
    });
    objReadline.on("close", function () {
      resolve(arr);
    });
  });
}

function getSpeciesStatistics(speciesId) {
  const filePath = `${statisticsDir}/${speciesId}`;
  let statistics = fs.readFileSync(filePath).toString().split("\n");
  let obj = {
    nodesNum:          parseInt(statistics[0]),
    edgesNum:          parseInt(statistics[1]),
    averageDegree:     parseFloat(statistics[2]),
    maximumDegree:     parseInt(statistics[3]),
    density:           parseFloat(statistics[4]),
    bfsFullDiam:       parseFloat(statistics[7]),
    bfsEffDiam:        parseFloat(statistics[8]),
    globalClustering:  parseFloat(statistics[9]),
    clustCf:           parseFloat(statistics[10]),
    starDensity2:      parseFloat(statistics[11]),
    starDensity3:      parseFloat(statistics[12]),
    giniCoefficient:   parseFloat(statistics[13]),
    edgeEntropy:       parseFloat(statistics[14]),
    assortativeMixing: parseFloat(statistics[15]),
  };
  return obj;
}

async function speciesToObj(speciesId) {
  let speciesTaxonomies = getSpeciesTaxonomies(speciesId);
  let speciesResilience = getSpeciesResilience(speciesId);
  let speciesDegrees    = await getSpeciesDegrees(speciesId);
  let speciesKcores     = await getSpeciesKcores(speciesId);
  let speciesLorenz     = await getSpeciesLorenz(speciesId);
  let speciesStatistic  = getSpeciesStatistics(speciesId);

  speciesObj = {
    ...speciesBasic[speciesId],
    taxonomies: speciesTaxonomies,
    resilience: speciesResilience,
    degrees: speciesDegrees,
    kcores: speciesKcores,
    lorenz: speciesLorenz,
    ...speciesStatistic,
  };
  // console.log(speciesObj);
  return speciesObj;
}

function getSpeciesNodes(speciesId) {
  return new Promise((resolve, reject) => {
    const filePath = `${betweennessDir}/${speciesId}`;
    var fRead = fs.createReadStream(filePath);
    var objReadline = readline.createInterface({ input: fRead });
    var arr = new Array();
    objReadline.on("line", function (line) {
      arr.push(line.split(" ")[0]);
    });
    objReadline.on("close", function () {
      resolve(arr);
    });
  });
}

async function speciesToJson(speciesId) {
  // 创建目录 ./species/{speciesId}
  if (!fs.existsSync(`${outputDir}/${speciesId}`)) {
    fs.mkdirSync(`${outputDir}/${speciesId}`);
  }

  // 写入文件 ./species/{speciesId}/{speciesId}.json
  const filePath = `${outputDir}/${speciesId}/${speciesId}.json`;
  fs.writeFileSync(filePath, JSON.stringify(await speciesToObj(speciesId)));

  // 创建目录 ./species/{speciesId}/nodes
  if (!fs.existsSync(`${outputDir}/${speciesId}/nodes`)) {
    fs.mkdirSync(`${outputDir}/${speciesId}/nodes`);
  }

  let speciesNodes            = await getSpeciesNodes(speciesId);
  let speciesBetweenness      = await getSpeciesBetweenness(speciesId);
  let speciesCloseness        = await getSpeciesCloseness(speciesId);
  let speciesClustering       = await getSpeciesClustering(speciesId);
  let speciesCurvature        = await getSpeciesCurvature(speciesId);
  let speciesDegreecentrality = await getSpeciesDegreecentrality(speciesId);
  let speciesOrca             = await getSpeciesOrca(speciesId);

  speciesNodes.forEach((nodeId) => {
    nodeToJson(speciesId, nodeId);
  });

  function nodeToJson(speciesId, nodeId) {
    const filePath = `${outputDir}/${speciesId}/nodes/${nodeId}.json`;
    fs.writeFileSync(filePath, JSON.stringify(nodeToObj(speciesId, nodeId)));
  }

  function nodeToObj(speciesId, nodeId) {
    let nodeObj = {
      speciesId:        speciesId,
      nodeId:           nodeId,
      betweenness:      speciesBetweenness[nodeId],
      closeness:        speciesCloseness[nodeId],
      clustering:       speciesClustering[nodeId],
      curvature:        speciesCurvature[nodeId],
      degreecentrality: speciesDegreecentrality[nodeId],
      orca:             speciesOrca[nodeId],
    };
    // console.log(nodeObj);
    return nodeObj;
  }
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

  console.log("# Start to jsonify species...");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  for (let i = 0; i < jobNum; i++) {
    console.log(`# (${i+1}/${jobNum}) ID: ${speciesIds[i]}`);
    await speciesToJson(speciesIds[i]);
  }

  console.log("# Finished.");
}

// 程序入口
main();
