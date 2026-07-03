require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { notFound, errorHandler } = require("./Src/Middleware/errorMiddleware");
const connectToDb = require("./Src/Config/Db");
const chatRouter = require("./Src/Routes/chatRoutes");
const UserRouter = require("./Src/Routes/userRoutes");
const messageRouter = require("./Src/Routes/messageRouter");
const initSocket = require("./Src/socket");

const app = express();
app.use(express.json());
app.use(cookieParser());

const clientOrigin = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";
app.use(cors({ origin: clientOrigin, credentials: true }));

connectToDb();

app.use("/api/user", UserRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT);