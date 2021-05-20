const fs = require("fs");
const readline = require("readline");
const ngraph = require("ngraph.graph");
const offlineLayout = require("ngraph.offline.layout");
const save = require("ngraph.tobinary");
const isComputedLayout = require('./judge').isComputedLayout;

const rootDir = `${__dirname}/..`;
const inputDir = `${rootDir}/data/input`;
const outputDir = `${rootDir}/data/output`;
const jobListPath = `${inputDir}/jobList.txt`;
const maxComponentDir = `${inputDir}/outputOfLifeTree/max-component`;

const options = [
  {
    optionName: "normal",
    layoutOptions: {
      springLength: 30,
      springCoeff: 0.0008,
      gravity: -1.2,
      dragCoeff: 0.02,
      timeStep: 20,
    },
    saveEach: 99999, // 不要保留中间结果
    iterations: 200,
    outDir: null, // 用到时再填写
  },
  {
    optionName: "sparse",
    layoutOptions: {
      springLength: 30,
      springCoeff: 0.0008,
      gravity: -1.2,
      dragCoeff: 0.02,
      timeStep: 100,
    },
    saveEach: 99999,
    iterations: 200,
    outDir: null,
  },
];

function createGraph(edgesFile) {
  let graph = ngraph();

  const interactomesStr = fs.readFileSync(edgesFile).toString();
  const interactomesArr = interactomesStr.split("\n");
  interactomesArr.splice(-1, 1); //最后一个元素是空的, 删之

  interactomesArr.forEach((line) => {
    const proteins = line.split(" ");
    graph.addLink(proteins[0], proteins[1]);
  });

  return graph;
}

function computeAndSaveLayout(graph, option) {
  console.log(
    "Graph parsed. Found " +
      graph.getNodesCount() +
      " nodes and " +
      graph.getLinksCount() +
      " edges"
  );

  var layout = offlineLayout(graph, option);
  console.log("Starting layout. This will take a while...");
  layout.run();
  console.log("Layout completed. Saving to binary format");
  save(graph, { outDir: option.outDir });
  console.log("Saved.");
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
  // 获取所有要计算layout的物种ID
  let speciesIds = await getSpeciesIds(jobListPath);
  let jobNum = speciesIds.length;

  console.log("# Start to compute layouts...");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  for (let i = 0; i < jobNum; i++) {
    console.log(`# (${i}/${jobNum}) ID: ${speciesIds[i]}`);
    if (isComputedLayout(speciesIds[i])) {
      console.log('Layout has been computed, skip.');
      continue;
    }

    let speciesDir = `${outputDir}/${speciesIds[i]}`;
    let layoutDir = `${speciesDir}/layout`;
    let edgesFile = `${maxComponentDir}/${speciesIds[i]}`;

    if (!fs.existsSync(speciesDir)) {
      fs.mkdirSync(speciesDir);
    }
    fs.mkdirSync(layoutDir);

    // 生成ngraph
    let graph = createGraph(edgesFile);

    // 根据options计算多个layout
    let manifestObj = {
      all: [],
      last: options[0]["optionName"],
    };
    options.forEach((option) => {
      console.log(
        `# Start to compute layout '${option["optionName"]}' of ${speciesIds[i]}`
      );
      option["outDir"] = `${layoutDir}/${option["optionName"]}`;
      // 用该option计算layout
      computeAndSaveLayout(graph, option);
      manifestObj["all"].push(option["optionName"]);
    });
    fs.writeFileSync(`${layoutDir}/manifest.json`, JSON.stringify(manifestObj));
  }

  console.log("# Finished.");
}

main();
