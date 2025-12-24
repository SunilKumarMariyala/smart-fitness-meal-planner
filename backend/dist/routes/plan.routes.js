"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workoutMealPlanController_1 = require("../controllers/workoutMealPlanController");
const router = (0, express_1.Router)();
router.post('/plans', workoutMealPlanController_1.createWorkoutMealPlan);
router.get('/plans/:userId', workoutMealPlanController_1.getWorkoutMealPlans);
router.put('/plans/:id', workoutMealPlanController_1.updateWorkoutMealPlan);
exports.default = router;
