import dotenv from 'dotenv';
dotenv.config();

import { sleep } from './utils.js';

import axios from "axios";
import qs from 'qs';

const OS_API_KEY = process.env.OS_API_KEY;
const OS_BASE_URL = 'https://api.opensea.io/api/v1';
const OS_LISTING_URL = 'https://api.opensea.io/wyvern/v1';

export default class OpenSeaApi {
    static RETURN_LIMIT = 50;
    static FILTER_LIMIT = 20;

    constructor() {
       
    }

    static async fetchAssetsFromContract(contractAddress, offset = 0, limit = 50) {
        let assets = [];

        try {
            let response = await axios.get(`${OS_BASE_URL}/assets`, {
                headers: {
                    'X-API-KEY': OS_API_KEY
                },
                params: {
                    asset_contract_address: contractAddress,
                    order_direction: 'desc',
                    offset: offset,
                    limit: limit
                }
            });
            
            assets = response.data.assets;
        } catch(e) {
            console.log(e);
        } finally {
            return assets;   
        }
    }

    // query options: https://docs.opensea.io/reference/retrieving-orders
    static async fetchListingsFromContract(contractAddress, tokenIds = [], offset = 0, limit = 50, orderBy = 'eth_price', order = 'asc') {
        let orders = [];

        try {
            // OS does not support more than 20 token_ids in filters
            let loops = Math.ceil(tokenIds.length / OpenSeaApi.FILTER_LIMIT) || 1;

            for(let i = 0; i < loops; i++) {
                let params = {
                    asset_contract_address: contractAddress,
                    bundled: false,
                    include_bundled: false,
                    order_direction: order, 
                    order_by: orderBy,
                    offset: offset,
                    limit: limit
                };

                if(tokenIds.length > 0) {
                    let filterOffset = OpenSeaApi.FILTER_LIMIT * i;
                    let currentLoopTokenIds = tokenIds.slice(filterOffset, filterOffset + OpenSeaApi.FILTER_LIMIT);

                    params.token_ids = currentLoopTokenIds;
                }

                let response = await axios.get(`${OS_LISTING_URL}/orders`, {
                    headers: {
                        'X-API-KEY': OS_API_KEY
                    },
                    params: params,
                    paramsSerializer: (params) => {
                        return qs.stringify(params, { arrayFormat: 'repeat' })
                    }
                });

                await sleep(550); // OS rate limiter is very aggressive

                orders.push(...response.data.orders);
            }

            await sleep(800);
            return [orders, null];
        } catch(e) {
            console.log(e);
            return [null, e];
        }
    }
};