import * as cryptoJs from 'crypto-js';
import { COLLECTION } from './constants';
import { DBService } from './db/dbService';

export default class UtilsLib {

    public static async getConfig(environment: string) {
        let envDoc = null;
        if (environment) {
            try {
                envDoc = await new DBService().get(COLLECTION.ENVIRONMENTS, environment);
            } catch (e) {
                console.log('could not get env ', e);
            }

            return envDoc;
        }
    };

    public static handleCrypto(env: string, action: string, data: any) {
        return new Promise((resolve, reject) => {
            UtilsLib.getConfig(env).then(config => {
                console.log('action', action.toLowerCase());
                try {
                    switch (action.toLowerCase()) {
                        case "encrypt": {
                            resolve(cryptoJs.AES.encrypt(JSON.stringify(data), config.clientSecret));
                        }
                            break;

                        case "decrypt": {
                            const bytes = cryptoJs.AES.decrypt(decodeURIComponent(data), config.clientSecret);
                            resolve(JSON.parse(bytes.toString(cryptoJs.enc.Utf8)));
                        }
                            break;
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
