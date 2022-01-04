export default class Farm {
    constructor(farmData) {
        this.id = farmData.id;
        this.tokenId = farmData.token_id;
        this.image = farmData.image_url;
        this.name = farmData.name;
        this.rawTraits = farmData.traits;
        
        this.computeStats();
    }

    computeStats() {
        let bunnies = 0;
        let frogs = 0;

        for(let trait of this.rawTraits) {
            switch(trait.value) {
                case "frog":
                    frogs++;
                    break;
                
                case "bunny":
                    bunnies++;
                    break;
                
                default:
                    //nothing
                    break;
            }

            this.bunnies = bunnies;
            this.frogs = frogs;
            this.animals = bunnies + frogs;
        }

        delete this.rawTraits;
    }
}

// grass
// grassl
// grassb

// desert
// desertr
// deserts

// waterf

// snow

// frog
// bunny

// daytime