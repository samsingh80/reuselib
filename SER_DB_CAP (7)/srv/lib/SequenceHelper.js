module.exports = class SequenceHelper {
    constructor(options) {
       this.sequence = options.sequence;
       this.db = options.db;
    }

    getNextNumber() {
        return new Promise((resolve, reject) => {
            let nextNumber = 0;
            this.db.run(`SELECT "${this.sequence}".NEXTVAL FROM DUMMY`)
                .then(result => {
                    nextNumber = result[0][`${this.sequence}.NEXTVAL`];
                    resolve(nextNumber);
                })
                .catch(error => {
                    reject(error);
                });

        });
    }
};