const TokenValidatorService = require("../services/JWTokenValidationService.js");
const database = require("../../models");

module.exports = class AuthController {
    static async login(req, res) {
        const user = req.body;
        try {
            let userExists = await database.Users.findOne({where: {
                name: user.name,
                password: user.password
            }});
            if (userExists) {
                return res.status(200).json({
                    message: "Login successful!",
                    token: TokenValidatorService.createToken(userExists.dataValues),
                    userId: userExists.dataValues.id
                })
            }
            return res.status(401).json({
                message: "Incorrect email or password!"
            });
        } catch(error) {
            return res.status(500).json({
                message: "Error!",
                error: error.message
            });
        }
    }

    static async createUser(req, res) {
        const user = req.body;
        user.name = user.name.toLowerCase();
        try {
            let userExists = await database.Users.findOne({where: {name: user.name}});
            if (!userExists) {
                await database.Users.create(user);
                return res.status(201).json({
                    message: "User created!"
                });
            }
            return res.status(500).json({
                message: "User already exists!"
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error creating user!",
                error: error.message
            })
        }
    }

    static async verifyToken(req, res) {
        try {
            var validation = TokenValidatorService.validateToken(req.params.token);
            if (validation) {
                return res.status(200).json({
                    message: "token valid",
                    isValid: true
                });
            }
            return res.status(401).json({
                message: "token invalid",
                isValid: false
            })
        } catch(error) {
            return res.status(401).json({
                message: "token invalid",
                error: error.message,
                isValid: false
            })
        }
    }
}