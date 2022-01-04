import fs from 'fs';

export function saveToFile(name, assets) {
    try {
        fs.writeFileSync(name, JSON.stringify(assets));
    } catch(error) { 
        console.log(error);
    }
}

export function readFromFile(name) {
    let fileContents

    try {
        fileContents = fs.readFileSync(name);
        return JSON.parse(fileContents);
    } catch(e) {
        console.log(e);
        return null;
    }
}

export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function sortByPrice(a, b) {
    return a.price - b.price;
}