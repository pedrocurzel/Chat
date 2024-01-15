const ChatController = require("../controllers/ChatController.js");
const jwtValidate = require("../services/JWTokenValidationService.js");

module.exports = (app) => {
    app.get("/get-all-users/:requestUserId", AuthMiddleware, ChatController.getAllUsers);
    app.post("/create-chat", AuthMiddleware, ChatController.createChat);
    app.get("/get-messages/:chatId", AuthMiddleware, ChatController.getMessages);
    app.post("/send-message", AuthMiddleware, ChatController.createMessage);
}

function AuthMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (jwtValidate.validateToken(token)) {
        next();
        return;
    }
    return res.status(401).json({
        message: "Unauthorized by token!"
    });
}