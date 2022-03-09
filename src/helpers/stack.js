module.exports = function Stack(array) {
    this.array = array;

    this.stack = element => this.array.push(element);

    this.unstack = () => this.array.pop();

    this.isEmpty = () => !this.array.length;

    this.length = () => this.array.length;

    this.peek = () => this.array[this.array.length - 1];
};
