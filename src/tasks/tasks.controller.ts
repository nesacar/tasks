import {
    Body,
    Controller,
    Delete,
    Get, Logger,
    Param,
    ParseIntPipe, Patch,
    Post,
    Query, UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {TasksService} from "./tasks.service";
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {Task} from "./task.entity";
import {TaskStatus} from "./task-status.enum";
import {TaskStatusValidationPipe} from "./pipes/task-status-validation.pipe";
import {AuthGuard} from "@nestjs/passport";
import {User} from "../auth/user.entity";
import {GetUser} from "../auth/get-user.decorator";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(private taskService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose('all tasks by: ' + user.username + '. Filters: ' + JSON.stringify(filterDto));
        return this.taskService.getTasks(filterDto, user);
    }

    @Get(':id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task>{
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user);
    }

    @Patch(':id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status, user);
    }

    @Delete(':id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.taskService.deleteTask(id, user);
    }
}
