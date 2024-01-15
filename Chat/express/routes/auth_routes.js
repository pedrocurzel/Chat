const AuthController = require("../controllers/AuthController.js");

module.exports = (app) => {
    app.post("/login", AuthController.login);
    app.post("/create-user", AuthController.createUser);
    app.get("/validate-token/:token", AuthController.verifyToken);
}