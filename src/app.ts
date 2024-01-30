import express from "express";
import router from "./http/routes/routes";
import { errorHandlersMiddleWare } from "./http/middlewares/errorHandlers";

export const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandlersMiddleWare);
