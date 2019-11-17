import { createApp, shutdownApp, App } from '../app'
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import appConfig, { AppMode } from '../config/config';

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
    if (appConfig.appMode !== AppMode.Test) {
        console.error('test can only be run in APP_MODE: "test"')
        process.exit(1)
    }
    const app = await createApp();
    await addUser('test', 'test', 'USER')
    await addUser('admin', 'admin', 'ADMIN')
    return app
}

export const testAppShutdown = async (app: App) => {
    await shutdownApp(app)
}