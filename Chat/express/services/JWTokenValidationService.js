const jwtoken = require("jsonwebtoken");

const KEY = "JSON@WEB@TOKEN@KEY";

module.exports = class JWTokenValidationService {
    static createToken(userObj) {
        return jwtoken.sign(userObj, KEY);
    }

    static validateToken(token) {
        try {
            jwtoken.verify(token, KEY);
            return true;
        } catch(error) {
            return false;
        }
    }


}