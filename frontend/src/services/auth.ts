class Auth {

    private auenticated = false

    constructor() {

    }

    isAuthenticated() {
        return this.auenticated
    }
}

export const auth = new Auth()

