export class JobNotFound extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, JobNotFound.prototype);
    }

}

export class BadInput extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, BadInput.prototype);
    }

}