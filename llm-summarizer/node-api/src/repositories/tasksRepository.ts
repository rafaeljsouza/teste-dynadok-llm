import fs from 'fs';
import path from 'path';
import { Task } from '../types/task';

class TasksRepository {
    // recebe o caminho e encapsula
    private readonly filePath: string;
    //checa o repositório e cria se necessário
    constructor() {
        this.filePath = path.join(__dirname, '../../data/tasks.json');
        this.initializeStorage();
    }

    private initializeStorage(): void {
        const directory = path.dirname(this.filePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]));
        }
    }

    // define métodos para requisitar tarefas (todas ou por ID)

    async getAllTasks(): Promise<Task[]> {
        const data = await fs.promises.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getTaskById(id: string): Promise<Task | null> {
        const tasks = await this.getAllTasks();
        return tasks.find(task => task.id === id) || null;
    }

    //método para criar as tarefas
    //atualiza as tasks, cria uma nova task usando a data como ID, 
    // adiciona a nova task às tasks atualizadas
    // aguarda o sistema escrever as tasks em formato JSON e retorna a nova task.


    async createTask(task: Omit<Task, 'id'>): Promise<Task> {
        const tasks = await this.getAllTasks();
        const newTask: Task = {
            ...task,
            id: Date.now().toString()
        };
        tasks.push(newTask);
        await fs.promises.writeFile(
            this.filePath, 
            JSON.stringify(tasks, null, 2), 
            { encoding: 'utf8' }
        );
        return newTask;
    }
    //testa (filtra) se a id da task fornecida está contida em tasks, se não estiver, retorna false
    //se estiver, aguarda o sistema sobrescrever as tasks filtradas nas tasks e retorna true

    async deleteTask(id: string): Promise<boolean> {
        const tasks = await this.getAllTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        if (filteredTasks.length === tasks.length) return false;
        await fs.promises.writeFile(this.filePath, JSON.stringify(filteredTasks, null, 2));
        return true;
    }
}

export const tasksRepository = new TasksRepository();