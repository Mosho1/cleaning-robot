const EventEmitter = require('events');

module.exports.Robot = class Robot extends EventEmitter {
    constructor() {
        super();
        this.movementDuration = 200;
        this.cleaningDuration = 0;
    }

    getMatrixFromMap(map) {
        const lines = map.split('\n');
        const numCols = Math.max(...lines.map(line => line.length));
        return lines.map(line => {
            const row = [];
            // this handles the case of an empty line in the input e.g.
            // ####
            // 
            // ####
            for (let i = 0; i < numCols; i++) {
                row.push(line[i] || ' ')
            }
            return row;
        });
    }

    getNumDirtyTiles(matrix) {
        return matrix.reduce(
            (sum, row) =>
                sum + row.filter(x => x === ' ').length,
            0);
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
        // edges of the matrix are treated as walls
        if (y < 0 ||
            x < 0 ||
            y >= this.rows ||
            x >= this.cols) {
            return false;
        }

        const tile = matrix[y][x];

        return tile !== '#' &&
            tile !== 'X';

    }

    allClean() {
        return this.state.tilesCleaned / this.state.tilesToClean === 1;
    }

    cleanTile() {
        const tilesCleaned = this.state.tilesCleaned + 1;

        Object.assign(this.state, {
            tilesCleaned,
        });

        this.state.matrix[this.state.y][this.state.x] = 'X';
        return new Promise(resolve => setTimeout(resolve, this.cleaningDuration));
    }

    moveTo(x, y) {
        Object.assign(this.state, {
            x, y, stepsTaken: this.state.stepsTaken + 1
        });
        return new Promise(resolve => setTimeout(resolve, this.movementDuration));
    }

    emitState() {
        this.state.duration = new Date() - this.state.startTime;
        this.emit('state', this.state);
    }

    resetState(map) {
        const matrix = this.getMatrixFromMap(map);
        this.state = {
            tilesCleaned: 0,
            efficiency: 0,
            duration: 0,
            stepsTaken: 0,
            startTime: new Date(),
            startTimeString: new Date().toString(),
            x: null,
            y: null,
            tilesToClean: this.getNumDirtyTiles(matrix),
            matrix
        };
    }

    async clean(startX, startY) {
        const { matrix } = this.state;
        if (!matrix) throw new Error('must call loadMap first');
        if (!this.isDirtyTile(startX, startY)) throw new Error('invalid start position');
        await this.moveTo(startX, startY);
        const dfs = async (dx, dy) => {
            const x = this.state.x + dx;
            const y = this.state.y + dy;

            if (!this.isDirtyTile(x, y)) return;
            await this.moveTo(x, y);
            await this.cleanTile();
            await this.emitState();

            await dfs(-1, 0);
            await dfs(1, 0);
            await dfs(0, -1);
            await dfs(0, 1);

            if (!this.allClean()) {
                await this.moveTo(this.state.x - dx, this.state.y - dy);
            }

            await this.emitState();
        };
        return dfs(0, 0);
    }
}
