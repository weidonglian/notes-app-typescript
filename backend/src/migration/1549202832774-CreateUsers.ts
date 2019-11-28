import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { User } from '../entity/User'

export class CreateAdminUser1547919837483 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const users = [
            {
                username: 'admin',
                password: 'admin',
                role: "ADMIN",
            },
            {
                username: 'dev',
                password: 'dev',
                role: "USER"
            },
            {
                username: 'test',
                password: 'test',
                role: "USER"
            }
        ]

        const userRepository = getRepository(User)
        for (let userObj of users) {
            let user = new User()
            user.username = userObj.username
            user.password = userObj.password
            user.role = userObj.role
            user.hashPassword()
            user.notes = []
            await userRepository.save(user)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}
