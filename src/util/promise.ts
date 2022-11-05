/** promise that can be resolve/rejected from outside scope */
export class SuperPromise<T> {

    readonly promise: Promise<T>;
    resolve: (value:unknown) => void;
    reject: (value:unknown) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject
            this.resolve = resolve
        })
    }

}
