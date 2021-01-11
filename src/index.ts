import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser"
import * as routes from "./routes";
import { errorHandler } from "./middleware/middleware";
import connect from "./config/connection";
import swaggerUi = require('swagger-ui-express');
import * as fs from "fs"

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler);

// initialize configuration
dotenv.config();
const port = process.env.SERVER_PORT;

// server side swagger configuration
const swaggerData = fs.readFileSync(process.cwd()+ "/src/swagger/swagger.json", 'utf8');
const swaggerDocument = JSON.parse(swaggerData);
app.use('/api/docs', swaggerUi.serve,swaggerUi.setup(swaggerDocument));

// Configure routes
routes.register(app);

// Connect database
connect(`${process.env.MONGO_URI}`);

// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});