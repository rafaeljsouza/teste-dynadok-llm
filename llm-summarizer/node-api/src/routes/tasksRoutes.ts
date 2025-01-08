import { Router } from 'express';
import { tasksRepository } from '../repositories/tasksRepository';
import { generateSummary } from '../services/pythonService';

const router = Router();

// Route to get all tasks
router.get('/', async (req, res) => {
    // Fetch all tasks from our repository
    const tasks = await tasksRepository.getAllTasks();
    // Return complete task objects instead of just text
    res.json(tasks.map(task => ({
        id: task.id,
        text: task.text,
        summary: task.summary,
        lang: task.lang
    })));
});

// Route to get a specific task by ID
router.get('/:id', async (req, res) => {
    // Try to find the task with the provided ID
    const task = await tasksRepository.getTaskById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
});

// Route to create a new task
router.post('/', async (req, res) => {
    const { text, lang } = req.body;

    if (!text || !lang) {
        return res.status(400).json({ message: 'Text and language are required' });
    }

    if (!['pt', 'en', 'es'].includes(lang)) {
        return res.status(400).json({ message: 'Language not supported' });
    }

    try {
        const summary = await generateSummary(text, lang);
        const task = await tasksRepository.createTask({
            text,
            summary,
            lang
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to generate summary',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});


// Route to delete a task
router.delete('/:id', async (req, res) => {
    const success = await tasksRepository.deleteTask(req.params.id);
    if (!success) {
        return res.status(404).json({ message: 'Task not found' });
    }
    // Return 204 No Content for successful deletion
    res.status(204).send();
});

export const tasksRoutes = router;