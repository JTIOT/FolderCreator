const program = require('commander');
const mkdirp = require('mkdirp')
const faker = require('faker');
const path = require('path');
const env = require('./env');

program.version('0.0.1');

program
  .option('-d, --depth <number>', 'Depth', 100)
  .option('-s, --spread <number>', 'Spread', 100)

program.parse(process.argv);

const getRandomStr = ()=>{
    return faker.random.number(Number(program.spread)).toString();
}

const getSpreads = (amount)=>{
    let allSpreads = [];
    let i = 0;
    while(i<amount){
        const str = getRandomStr();
        if(!allSpreads.includes(str)){
            allSpreads.push(str);
            i++;
        }
    }
    return allSpreads;
}

const getPath = async (depth, spread)=>{
    let rootComps = []
    let folderPath = []
    let lastRoot = env==='production'?path.dirname(process.execPath):__dirname;

    for(let i = 0; i<depth; i++){
        lastRoot = path.join(lastRoot, getRandomStr()).toString();
        rootComps.push(lastRoot);
    }

    for(let i=0; i<rootComps.length; i++){
        const rootPath = rootComps[i];
        let subPath = [];
        const allSpreads = getSpreads(spread);
        for(let j=0; j<spread; j++){
            subPath.push(path.join(rootPath,allSpreads[j]).toString());
            // subPath.push(rootPath+'/'+allSpreads[j]);
        }
        folderPath.push(subPath);
    }

    return folderPath;
}

const createFolder = async (paths)=>{
    for(let i=0; i<paths.length; i++){
        try{
            const made = await mkdirp(paths[i]);
            console.log('create folder at ', made);
        }
        catch(err){
            console.log(err);
        }
    }
}

const main = async ()=>{
    if(program.depth && program.spread){
        const depth = Number(program.depth);
        const spread = Number(program.spread);

        console.log('Preparing......');
        const folderPath = await getPath(depth, spread);
        
        await createFolder(folderPath.flat(1));
        console.log('Complete folder creation');
    }
}

main();

