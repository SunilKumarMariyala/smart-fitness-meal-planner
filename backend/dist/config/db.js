"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const pool = mysql2_1.default.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'mypass@root12345S',
    database: 'smart_fitness_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
exports.db = pool.promise();
