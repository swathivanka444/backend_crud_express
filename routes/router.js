const express = require('express');
const router = express.Router();
const tasks = require("../models/taskSchema");
const mongoose = require('mongoose');
router.use(express.json()); 
//post API
router.post("/AddTask", async (req, res) => {
    const { title, description, mark } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: "Please fill in both title and description." });
    }
    try {
        const pretask = await tasks.findOne({ description: description });
        if (pretask) {
            return res.status(400).json({ error: "This task is already present." });
        } else {
            const addtask = new tasks({ title, description, mark });
            const savedTask = await addtask.save();
            return res.status(201).json(savedTask);
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
router.get('/AllTasks', async (req, res) => {
    try {
        const { taskId } = req.query;
        if (taskId) {
            const task = await tasks.findById(taskId)
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            return res.json(task);
        } else {
            const allTasks = await tasks.find();
            return res.json(allTasks);
        }
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/DeleteTask', async (req, res) => {
    try {
        const { taskId } = req.query;
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: 'Invalid Task ID' });
        }
        const deletedTask = await tasks.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/UpdateTask', async (req, res) => {
    try {
        const { taskId } = req.query;
        if (taskId) {
            const task = await tasks.findById(taskId)
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            return res.json(task);
        } else {
            const allTasks = await tasks.find();
            return res.json(allTasks);
        }
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.put('/UpdateTask/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const updatedTaskData = req.body;
        const updatedTask = await tasks.findByIdAndUpdate(taskId, updatedTaskData);
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
