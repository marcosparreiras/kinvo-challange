import { knex as knexInit } from "knex";
import config from "../../../knexfile";
import env from "../../env";

const knexConfig = env.NODE_ENV === "test" ? config.test : config.development;
export const knex = knexInit(knexConfig);
