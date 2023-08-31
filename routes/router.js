const express = require('express');
const router = express.Router();
const tasks = require("../models/taskSchema");
const users = require("../models/usersSchema");
const mongoose = require('mongoose');
router.use(express.json()); 
//post API
router.post("/AddTask", async (req, res) => {
    const { title, description, mark } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: "Please fill in both title and description." });
    }
    try {
        const addtask = new tasks({ title, description, mark });
        const savedTask = await addtask.save();
        return res.status(201).json(savedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.post("/AddUser", async (req, res) => {
    const { email,password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Please fill in both email and password." });
    }
    try {
        const preuser = await users.findOne({email: email });
        if (preuser) {
            return res.status(400).json({ error: "This user is already present." });
        } else {
            const adduser = new users({ email,password });
            const savedUser = await adduser.save();
            console.log(savedUser)
            return res.status(201).json(savedUser);
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/LoginUser", async (req, res) => {
    const { email,password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Please fill in both email and password." });
    }
    try {
        const preuser = await users.findOne({email: email });
    
        if (preuser) {
            if(preuser.password==password)
            {
                return res.status(200).json({ messsage: "Login Successfull" });
            }
            else{
                return res.status(401).json({ messsage: "Incorrect Password" });
            }
            
        } else {
          
            return res.status(400).json({ messsage: "User does not exist " });
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
