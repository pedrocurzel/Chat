const database = require("../../models");
const { Op } = require("sequelize");
module.exports = class ChatController {
    static async getAllUsers(req, res) {
        const {requestUserId} = req.params;
        try {
            var users = await database.Users.findAll(
                {
                    attributes: ["id", "name"],
                    where: {
                        id: {
                            [Op.ne]: requestUserId
                        }
                    }
                }
            );
            console.log(users);
            return res.status(200).json({
                message: "Users retrieved!",
                users
            });
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                message: "Error!",
                error: error.message
            });
        }
    }

    static async createChat(req, res) {
        const chat = req.body;
        try {
            let chats = await database.Chats.findOne({
                where: {
                    user1: chat.userId1,
                    user2: chat.userId2
                }
            });
            
            if (!chats) {
                let chatCreated = await database.Chats.create({user1: chat.userId1, user2: chat.userId2});
                return res.status(201).json({
                    message: "Chat created!",
                    chatCreated
                })
            }

            return res.status(200).json({
                message: "Chat already exists!",
                chats
            });
        } catch(error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }

    static async getMessages(req, res) {
        const {chatId} = req.params;
        try {
            let messages = await database.ChatMessages.findAll({
                where: {
                    chatId
                },
                order: [
                    ['createdAt', 'ASC'],
                ],
            });
            res.status(200).json({
                messages
            })
        } catch(error) {
            res.status(500).json({
                error: error.message
            })
        }
    }

    static async createMessage(req, res) {
        const message = req.body;

        try {
            var messageCreated = await database.ChatMessages.create(message);
            return res.status(201).json({
                message: "Message created!",
                messageCreated
            });
        } catch(error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
}