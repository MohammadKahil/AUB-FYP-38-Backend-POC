export class UserNotFound extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UserNotFound.prototype);
    }

}

export class BadInput extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BadInput.prototype);
    }

}

