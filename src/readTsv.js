var tsv = require('tsv');
var fs = require('fs');

const rootDir             = `${__dirname}/../`;
const speciesBasicInfoDir = `${rootDir}/data/input/speciesBasicInfo`;
const speciesNamePath     = `${speciesBasicInfoDir}/speciesName.tsv`;
const pubmedCountPath     = `${speciesBasicInfoDir}/pubmedCount.tsv`;
const evolutionPath       = `${speciesBasicInfoDir}/evolution.tsv`;

function compare(property){
    return function(obj1, obj2){
        var value1 = parseInt(obj1[property]);
        var value2 = parseInt(obj2[property]);
        return value1 - value2;
    }
}

function getAllEvolution() {
  let evolution = tsv.parse(fs.readFileSync(evolutionPath).toString());
  return evolution;
}

function getSpeciesBasicObj() {
    let speciesName = tsv.parse(fs.readFileSync(speciesNamePath).toString());
    let pubmedCount = tsv.parse(fs.readFileSync(pubmedCountPath).toString());
    let evolution = tsv.parse(fs.readFileSync(evolutionPath).toString());

    speciesName.sort(compare('Species_ID'));
    pubmedCount.sort(compare('Species_ID'));
    evolution.sort(compare('Species_ID'));

    let speciesBasicArr = [];
    for (let i=0; i<1840; i++) {
        let obj = {};
        obj['id'] = speciesName[i]['Species_ID'];
        obj['compactName'] = speciesName[i]['Compact_name'];
        obj['ncbiName'] = speciesName[i]['Official_NCBI_name'];
        obj['pubCount'] = pubmedCount[i]['Publication_count'];

        speciesBasicArr.push(obj);
    }

    let i = 0;
    for (let j=0; j<1401; j++) {
        while (evolution[j]['Species_ID'] != speciesBasicArr[i]['id']) {
            i++;
        }
        speciesBasicArr[i]['evolution'] = parseFloat(evolution[j]['Evolution']);
        speciesBasicArr[i]['domain'] = evolution[j]['Domain'];
        i++;
    }

    let speciesBasicObj = {};
    speciesBasicArr.forEach((obj) => {
       speciesBasicObj[obj['id']] = obj;
    })

    return speciesBasicObj;
}

exports.getSpeciesBasicObj = getSpeciesBasicObj;
exports.getAllEvolution = getAllEvolution;
