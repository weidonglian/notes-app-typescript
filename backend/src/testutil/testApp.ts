import { createApp, shutdownApp, App } from '../app'
import { User } from '../entity/User';
import { getRepository } from 'typeorm';

const addUser = async (name: string, password: string, role: string) => {
    let user = new User;
    user.username = name;
    user.password = password;
    user.hashPassword();
    user.role = role;
    const userRepository = getRepository(User);
    await userRepository.save(user);
}

export const testAppWithTestUser = async () => {
    const app = await createApp();
    await addUser('test', 'test', 'USER')
    await addUser('admin', 'admin', 'ADMIN')
    return app
}

export const testAppShutdown = async (app: App) => {
    await shutdownApp(app)
}