export default class User {
    id: number;
    name: string;
    
    constructor(userObj: any) {
        this.id = userObj.id;
        this.name = userObj.name;
    }
}