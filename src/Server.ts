import express from "express";
import http from "http";
import cors from "cors";
import compression from "compression";
import { config } from "./config/config";
import Logging from "./middleware/Logging";
import cookieParser from 'cookie-parser';
import { ormProject } from "./sequelize"; // Import Sequelize instance from your database file

const app = express();

var corsOptions = {
    origin: "http://localhost:5432",
};
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const StartServer = () => {
    app.use((req, res, next) => {
        Logging.info(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on("finish", () => {
            if (res.statusCode == 200 || res.statusCode == 201) {
                Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
            } else {
                Logging.error(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
            }
        });
        next();
    });

    app.use("/ping", (req, res, next) => res.status(200).json({ message: "Working" }));

    http.createServer(app).listen(config.server.port, () =>
        Logging.info(`Server is running on Port ${config.server.port}.`)
    );
};

// Check database connection
ormProject.authenticate()
    .then(() => {
        Logging.info("Database connected successfully.");
        StartServer();
    })
    .catch((error:any) => {
        Logging.error(`Unable to connect to the database: ${error}`);
    });

export default app;

//By Prabhdeep Singh
