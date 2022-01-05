import Discord from 'discord.js';

import OpenSeaApi from './lib/osApi.js';
import Farm from './models/farm.js';
import Listing from './models/listing.js';

import { readFromFile, saveToFile, sortByPrice } from './lib/utils.js';

const FUD_FARM_ADDRESS = '0x94d4a314fc718adfb3e9e25d3e3a984862ec7f1b';
const FUD_FARM_COUNT = 7777;
const BOT_TOKEN = process.env.BOT_TOKEN;

class Bot {
    constructor() {
        this.prefix = '!';
        this.client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

        this.client.on("messageCreate", async message => { 
            if (message.author.bot) return;
            if (!message.content.startsWith(this.prefix)) return;
    
            const commandBody = message.content.slice(this.prefix.length);
            const args = commandBody.split(' ');
            const command = args.shift().toLowerCase();

            await this.execute(message, command, args);
        });

        this.client.login(BOT_TOKEN);
    }

    async execute(message, command, args) {
        switch(command) {
            case 'ping':
                const timeTaken = Date.now() - message.createdTimestamp;
                message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
                break;


            case 'floors':
                let response = await this.getFloors();
                message.reply(response);
                break;
                

            default:
                message.reply(`Unknown command.`);
                break;
        }
    }

    async getFloors() {
        // let simples = readFromFile('../data/simples.txt');
        let doubles = readFromFile('./data/doubles.txt');
        let triples = readFromFile('./data/triples.txt');
        let quadruples = readFromFile('./data/quadruples.txt');
    
        let floorDoubleListing = await OpenSeaApi.fetchListingsFromContract(FUD_FARM_ADDRESS, doubles, 0, OpenSeaApi.FILTER_LIMIT);
        let floorTripleListing = await OpenSeaApi.fetchListingsFromContract(FUD_FARM_ADDRESS, triples, 0, OpenSeaApi.FILTER_LIMIT);
        let floorQuadrupleListing = await OpenSeaApi.fetchListingsFromContract(FUD_FARM_ADDRESS, quadruples, 0, OpenSeaApi.FILTER_LIMIT);
    
        let floorDouble = floorDoubleListing.map(listingData => new Listing(listingData)).sort(sortByPrice)[0];
        let floorTriple = floorTripleListing.map(listingData => new Listing(listingData)).sort(sortByPrice)[0];
        let floorQuadruple = floorQuadrupleListing.map(listingData => new Listing(listingData)).sort(sortByPrice)[0];

        let message = `Lowest double is ${floorDouble?.price} eth (ID: #${floorDouble?.tokenId})
Lowest triple is ${floorTriple?.price} eth (ID: #${floorTriple?.tokenId})
Lowest quadruple is ${floorQuadruple?.price} eth (ID: #${floorQuadruple?.tokenId})`;
    
        return message;
    };

    async fetchAssets() {
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
    };
}

const botInstance = new Bot();