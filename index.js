import OpenSeaApi from './lib/osApi.js';
import Farm from './models/farm.js';
import Listing from './models/listing.js';
import { saveToFile, readFromFile, sleep, sortByPrice } from './lib/utils.js';

const FUD_FARM_ADDRESS = '0x94d4a314fc718adfb3e9e25d3e3a984862ec7f1b';
const FUD_FARM_COUNT = 7777;
const LIMIT = OpenSeaApi.RETURN_LIMIT;

async function getFloors() {
    // let simples = readFromFile('./data/simples.txt');
    let doubles = readFromFile('./data/doubles.txt');
    let triples = readFromFile('./data/triples.txt');
    let quadruples = readFromFile('./data/quadruples.txt');

    let floorDoubleListing = await OpenSeaApi.fetchListingsFromContract(FUD_FARM_ADDRESS, doubles, 0, 20);
    let floorTripleListing = await OpenSeaApi.fetchListingsFromContract(FUD_FARM_ADDRESS, triples, 0, 20);
    let floorQuadrupleListing = await OpenSeaApi.fetchListingsFromContract(FUD_FARM_ADDRESS, quadruples, 0, 20);

    let floorDouble = floorDoubleListing.map(listingData => new Listing(listingData)).sort(sortByPrice)[0];
    let floorTriple = floorTripleListing.map(listingData => new Listing(listingData)).sort(sortByPrice)[0];
    let floorQuadruple = floorQuadrupleListing.map(listingData => new Listing(listingData)).sort(sortByPrice)[0];

    console.log(`Lowest double is ${floorDouble?.price} eth (ID: #${floorDouble?.tokenId})`);
    console.log(`Lowest triple is ${floorTriple?.price} eth (ID: #${floorTriple?.tokenId})`);
    console.log(`Lowest quadruple is ${floorQuadruple?.price} eth (ID: #${floorQuadruple?.tokenId})`);
}

getFloors();

async function fetchAssets() {
    let farms = [];

    let singles = [];
    let doubles = [];
    let triples = [];
    let quadruples = [];
    let bunnies = [];
    let frogs = [];

    let loops = Math.ceil(FUD_FARM_COUNT / LIMIT);

    for(let i = 0; i < loops; i++) {
        let offset = LIMIT * i;

        console.log(`fetching farms ${offset} - ${(offset + LIMIT - 1)}`);
        let reqFarms = await OpenSeaApi.fetchAssetsFromContract(FUD_FARM_ADDRESS, offset, LIMIT);

        for(let farmData of reqFarms) {
            let farm = new Farm(farmData);

            if(farm.animals == 1) {
                singles.push(farm.tokenId);
            }

            if(farm.animals == 2) {
                doubles.push(farm.tokenId);
            }

            if(farm.animals == 3) {
                triples.push(farm.tokenId);
            }

            if(farm.animals == 4) {
                quadruples.push(farm.tokenId);
            }

            if(farm.bunnies >= 1) {
                bunnies.push(farm.tokenId);
            }

            if(farm.frogs >= 1) {
                frogs.push(farm.tokenId);
            }

            farms.push(farm);
        }

        await sleep(200);
    }

    saveToFile('./data/farms.txt', farms);
    saveToFile('./data/singles.txt', singles);
    saveToFile('./data/doubles.txt', doubles);
    saveToFile('./data/triples.txt', triples);
    saveToFile('./data/quadruples.txt', quadruples);
    saveToFile('./data/bunnies.txt', bunnies);
    saveToFile('./data/frogs.txt', frogs);
}