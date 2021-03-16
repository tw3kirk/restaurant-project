export class Restaurant {
    constructor(
        public name: string,
        public city?: string,
        public state?: string,
        public telephone?: string,
        public genre?: string,
    ) {}

    /**
     * instantiate a new Restaurant from untyped JSON
     * @param pojo JSON to parse
     */
    public static fromJson(pojo: Restaurant) {
        if (pojo) {
            const restaurant = new Restaurant('');
            Object.assign(restaurant, pojo);

            return restaurant;
        } else {
            return null;
        }
    }

    /**
     * get the value of a field given the field name
     * @param fieldName the field of the restaurant object to filter
     */
    public get(fieldName: string): string {
        const restOb = <any>this;
        return restOb.hasOwnProperty(fieldName) ? restOb[fieldName].toString() : "";
    }
}
