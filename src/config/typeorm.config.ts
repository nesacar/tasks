import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'default',
    password: 'secret',
    database: 'taskmanagment',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
};