import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {TaskStatus} from "./task-status.enum";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {
    }

    tasks = [];

    async getTasks(
        filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(
        id: number,
        @GetUser() user: User
    ): Promise<Task> {
        const task = await this.taskRepository.findOne({where: { id, userId: user.id }});

        if(!task){
            throw new NotFoundException(`Task with ID: ${id} not found`);
        }

        return task;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task>{
        return this.taskRepository.createTask(createTaskDto, user);
    }


    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(
        id: number,
        @GetUser() user: User
    ): Promise<void>{
        const result = await this.taskRepository.delete({id, userId: user.id});

        if(result.affected === 0){
            throw new NotFoundException(`Task with ID: ${id} not found`);
        }
    }
}
