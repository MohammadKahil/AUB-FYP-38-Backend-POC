export class UserNotFound extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, UserNotFound.prototype);
    }

}