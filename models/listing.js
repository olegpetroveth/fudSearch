export default class Listing {

    constructor(listingData) {
        this.id = listingData.id;
        this.assetId = listingData.asset.id;
        this.tokenId = listingData.asset.token_id;
        this.image = listingData.asset.image_url;
        this.price = parseFloat(listingData.current_price) / 1e18;
    }
}