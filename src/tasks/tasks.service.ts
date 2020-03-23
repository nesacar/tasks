import {Injectable} from '@nestjs/common';
import {Task, TaskStatus} from "./tasks.model";
import * as uuid from 'uuid/v1';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    createTask(title: string, description: string){
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.DONE
        };

        this.tasks.push(task);

        return task;
    }
}
