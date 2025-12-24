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
exports.updateWorkoutMealPlan = exports.getWorkoutMealPlans = exports.createWorkoutMealPlan = void 0;
const db_1 = require("../config/db");
const createWorkoutMealPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, day, exercises, meals, completed_status } = req.body;
    if (!user_id || !day || !exercises || !meals) {
        return res.status(400).json({ message: 'User ID, day, exercises, and meals are required' });
    }
    try {
        const [result] = yield db_1.db.query('INSERT INTO WorkoutMealPlans (user_id, day, exercises, meals, completed_status) VALUES (?, ?, ?, ?, ?)', [user_id, day, JSON.stringify(exercises), JSON.stringify(meals), JSON.stringify(completed_status || {})]);
        res.status(201).json(Object.assign({ id: result.insertId }, req.body));
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating workout/meal plan', error });
    }
});
exports.createWorkoutMealPlan = createWorkoutMealPlan;
const getWorkoutMealPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const [rows] = yield db_1.db.query('SELECT * FROM WorkoutMealPlans WHERE user_id = ?', [userId]);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching workout/meal plans', error });
    }
});
exports.getWorkoutMealPlans = getWorkoutMealPlans;
const updateWorkoutMealPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { exercises, meals, completed_status } = req.body;
    if (!exercises || !meals) {
        return res.status(400).json({ message: 'Exercises and meals are required' });
    }
    try {
        yield db_1.db.query('UPDATE WorkoutMealPlans SET exercises = ?, meals = ?, completed_status = ? WHERE id = ?', [JSON.stringify(exercises), JSON.stringify(meals), JSON.stringify(completed_status || {}), id]);
        res.json(Object.assign({ id }, req.body));
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating workout/meal plan', error });
    }
});
exports.updateWorkoutMealPlan = updateWorkoutMealPlan;
