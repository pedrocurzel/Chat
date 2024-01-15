const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const auth_routes = require("./routes/auth_routes.js");
const chat_routes = require("./routes/chat_routes.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
auth_routes(app);
chat_routes(app);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log(`socket ${socket.id} conectou`);
    socket.on("usuario_conectado", userId => {
        console.log(userId);
        socket.join(`${userId}`);
    });

    socket.on("mensagem_enviada", values => {
        console.log(values);
        socket.to(`${values.userReceiver.id}`).emit("enviar_alerta", {
            message: `Você recebeu uma mensagem de ${values.userSender.name}`,
            senderId: values.userSender.id
        });

        socket.to(`${values.userReceiver.id}`).emit("enviar_mensagem", values.mensagem);
    })
});

server.listen(3000, () => console.log("server running port 3000"));
