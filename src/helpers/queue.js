module.exports = function Queue(array) {
    this.array = array;

    this.enqueue = element => this.array.push(element);

    this.dequeue = () => this.array.shift();

    this.isEmpty = () => !this.array.length;

    this.length = () => this.array.length;

    this.peek = () => this.array[0];
};
