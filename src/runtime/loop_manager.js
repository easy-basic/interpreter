class Loop {
    constructor(type, index, params) {
        this.type = type;
        this.params = params;
        this.counter = 0;
        this.index = index;
    }
}

export default class LoopManager {
    constructor() {
        this.loops = [];
    }

    registerLoop(type, index, params) {
        this.loops.push(new Loop(type, index, params))
    }

    destroyLastLoop() {
        this.loops.pop();
    }

    getLastLoop(type) {
        var filtered = this.loops.filter((l) => l.type == type);
        return filtered[filtered.length - 1];
    }
}