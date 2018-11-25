const EventEmitter = require('events');

module.exports.Robot = class Robot extends EventEmitter {
    constructor() {
        super();
        this.movementDuration = 200;
        this.cleaningDuration = 0;
    }

    getMatrixFromMap(map) {
        return map.split('\n').map(line => [...line]);
    }

    getNumDirtyTiles(map) {
        return map.split(' ').length - 1;
    }

    get rows() {
        return this.state.matrix.length;
    }

    get cols() {
        return this.state.matrix[0].length;
    }

    loadMap(map) {
        this.resetState(map)
    }

    isDirtyTile(x, y) {
        const { matrix } = this.state;
        const tile = matrix[y][x];
        return tile !== '#' &&
            tile !== 'X' &&
            y >= 0 && x >= 0 &&
            y < this.rows &&
            x < this.cols;

    }

    allClean() {
        return this.state.percentageCleaned === 1;
    }

    cleanTile() {
        const tilesCleaned = this.state.tilesCleaned + 1;
        const percentageCleaned = tilesCleaned / this.state.tilesToClean;

        Object.assign(this.state, {
            tilesCleaned,
            percentageCleaned
        });

        this.state.matrix[this.state.y][this.state.x] = 'X';
        return new Promise(resolve => setTimeout(resolve, this.cleaningDuration));
    }

    moveTo(x, y) {
        Object.assign(this.state, {
            x, y
        });
        return new Promise(resolve => setTimeout(resolve, this.movementDuration));
    }

    emitState() {
        this.state.duration = new Date() - this.state.startTime;
        this.emit('state', this.state);
    }

    resetState(map) {
        this.state = {
            tilesCleaned: 0,
            percentageCleaned: 0,
            efficiency: 0,
            duration: 0,
            startTime: new Date(),
            startTimeString: new Date().toString(),
            x: null,
            y: null,
            tilesToClean: this.getNumDirtyTiles(map),
            matrix: this.getMatrixFromMap(map)
        };
    }

    async clean(startX, startY) {
        const { matrix } = this.state;
        if (!matrix) throw new Error('must call loadMap first');
        if (!this.isDirtyTile(startX, startY)) throw new Error('invalid start position');
        await this.moveTo(startX, startY);
        const dfs = async (x, y, fromX, fromY) => {
            if (!this.isDirtyTile(x, y)) return;
            await this.moveTo(x, y);
            await this.cleanTile();
            await this.emitState();
            if (this.allClean()) {
                return;
            }
            await dfs(x - 1, y, x, y);
            await dfs(x + 1, y, x, y);
            await dfs(x, y + 1, x, y);
            await dfs(x, y - 1, x, y);

            await this.moveTo(fromX, fromY);
            await this.emitState();
        };
        return dfs(startX, startY);
    }
}
