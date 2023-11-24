export class JobNotFound extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, JobNotFound.prototype);
    }

}

export class JobAlreadyExists extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, JobAlreadyExists.prototype);
    }

}