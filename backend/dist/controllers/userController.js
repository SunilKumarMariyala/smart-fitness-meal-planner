"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = void 0;
const db_1 = require("../config/db");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, age, gender, height, weight, goal } = req.body;
    if (!name || !age || !gender || !height || !weight || !goal) {
        return res.status(400).json({ message: 'All profile fields are required' });
    }
    if (!['weight loss', 'muscle gain', 'maintenance'].includes(goal)) {
        return res.status(400).json({ message: 'Invalid goal' });
    }
    try {
        const [result] = yield db_1.db.query('INSERT INTO Users (name, age, gender, height, weight, goal) VALUES (?, ?, ?, ?, ?, ?)', [name, age, gender, height, weight, goal]);
        res.status(201).json(Object.assign({ id: result.insertId }, req.body));
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [rows] = yield db_1.db.query('SELECT * FROM Users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, age, gender, height, weight, goal } = req.body;
    if (!name || !age || !gender || !height || !weight || !goal) {
        return res.status(400).json({ message: 'All profile fields are required' });
    }
    if (!['weight loss', 'muscle gain', 'maintenance'].includes(goal)) {
        return res.status(400).json({ message: 'Invalid goal' });
    }
    try {
        yield db_1.db.query('UPDATE Users SET name = ?, age = ?, gender = ?, height = ?, weight = ?, goal = ? WHERE id = ?', [name, age, gender, height, weight, goal, id]);
        res.json(Object.assign({ id }, req.body));
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.db.query('DELETE FROM Users WHERE id = ?', [id]);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});
exports.deleteUser = deleteUser;
