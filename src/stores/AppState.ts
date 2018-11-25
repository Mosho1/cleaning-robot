import { observable, action } from 'mobx';

const hasWindow = typeof window !== 'undefined';

interface RobotState {
  x: number | null;
  y: number | null;
  tilesCleaned: number;
  percentageCleaned: number;
  tilesToClean: number;
  startTime: Date;
  startTimeString: string;
  duration: number;
  matrix: (' ' | '\n' | 'X' | '#')[][] | null;
}

interface RobotParams {
  map: string;
  x: string;
  y: string;
}

export interface AppStateProps {
  robotState: RobotState;
}

/*
* This is the entry point for the app's state. All stores should go here.
*/
class AppState implements AppStateProps {
  @observable timer = 0;
  @observable message = '';
  @observable params: RobotParams = {
    x: '1',
    y: '1',
    map: `#######
#     #
# #   #
#   # #
#######`
  };

  @observable robotState = {
    x: null,
    y: null,
    tilesCleaned: 0,
    tilesToClean: 0,
    startTime: null,
    startTimeString: '',
    duration: 0,
    percentageCleaned: 0,
    matrix: null
  };

  intervalId: any;

  socket: WebSocket;

  constructor() {
    if (hasWindow) {
      this.socket = new WebSocket(`ws://${location.host}/robot`);
      this.socket.onmessage = this.handleMessage;
    }
  }

  @action start() {
    this.socket.send(JSON.stringify(this.params));
  }

  @action setX(x: string) {
    this.params.x = x;
  }

  @action setY(y: string) {
    this.params.y = y;
  }

  @action setMap(map: string) {
    this.params.map = map;
  }

  @action handleMessage = ({ data }) => {
    const robotState = JSON.parse(data);
    this.robotState = robotState;
  }

  reload(store?: AppStateProps) {
    if (store)
      this.robotState = store.robotState;
    return this;
  }

  unload() {
    this.socket.close();
  }
}

export default AppState;