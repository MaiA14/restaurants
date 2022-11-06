import { COLLECTION, OPERANDS } from "../constants";
import { DBService } from "../db/dbService";

export default class RestaurantsService {
    public static async getRestaurantByName(name: string) {
        try {
            let where: any = {};
            where['name'] = { operand: OPERANDS.EQUALS, value: name };
            const restaurant = await new DBService().get(COLLECTION.RESTAURANTS, null, where);
            return restaurant[0];
        } catch (e) {
            console.log('cannot get restaurant', e);
            return;
        }
    }
}