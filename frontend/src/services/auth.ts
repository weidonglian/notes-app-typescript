import { apiClient } from './request';

export interface LoginUser {
    username: string
    password: string
    remember?: boolean
}

export interface LoginCredentials {
    access_token: string
    refresh_token: string
    username: string
}

export interface SignupUser {
    username: string
    password: string
}

const credentialsKey = 'credentials'

/**
 * Provides a base for authentication workflow.
 * The LoginCredentials interface as well as login/logout methods should be replaced with proper implementation.
 */
export class AuthService {
    private _credentials: LoginCredentials | null

    constructor() {
        const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
        if (savedCredentials) {
            this.setCredentials(JSON.parse(savedCredentials), true);
        }
    }

    signup(user: SignupUser) {
        return apiClient.post('/auth/signup', {
            username: user.username,
            password: user.password
        })
    }

    async login(user: LoginUser) {
        const respLogin = await apiClient.post('/auth/login', {
            username: user.username,
            password: user.password
        })
        const { token } = respLogin.data
        this.setCredentials({
            username: user.username,
            access_token: token,
            refresh_token: token
        }, user.remember)
    }

    logout() {
        this.setCredentials();
        if (this.isAuthenticated()) {
            // TODO request remote server /logout
        }
    }

    get username() {
        return this._credentials ? this._credentials.username : null
    }

    isAuthenticated(): boolean {
        return !!this._credentials
    }

    get credentials(): LoginCredentials | null {
        return this._credentials;
    }

    setCredentials(credentials?: LoginCredentials, remember?: boolean) {
        this._credentials = credentials || null;

        if (credentials) {
            const storage = remember ? localStorage : sessionStorage
            storage.setItem(credentialsKey, JSON.stringify(credentials))
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${credentials.access_token}`
        } else {
            sessionStorage.removeItem(credentialsKey)
            localStorage.removeItem(credentialsKey)
            apiClient.defaults.headers.common['Authorization'] = null
        }
    }
}

export const auth = new AuthService()

