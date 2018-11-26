import * as React from 'react';
import AppState from '../stores/AppState';
import { observer } from 'mobx-react';
import * as style from './styles.css';

@observer
class Home extends React.Component<{ appState: AppState }, any> {

  onClick = () => {
    this.props.appState.start()
  }

  onChangeMap = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.props.appState.setMap(e.target.value)
  }

  onChangeX = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.appState.setX(e.target.value)
  }

  onChangeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.appState.setY(e.target.value)
  }

  render() {
    const { robotState, params } = this.props.appState;
    const { duration, startTimeString, stepsTaken, tilesCleaned, tilesToClean, x, y, matrix } = robotState;
    const percentageCleaned = tilesCleaned / tilesToClean || 0;
    const efficiency = tilesCleaned / stepsTaken || 0;
    return (
      <div className={style.home}>
        <h1>
          Welcome to CleanSim™!
        </h1>
        <div>Started at: {startTimeString}</div>
        <div>Duration: {duration}ms</div>
        <div>Tiles Cleaned: {tilesCleaned}/{tilesToClean}</div>
        <div>Percentage Cleaned: {(100 * percentageCleaned).toString().slice(0, 5)}%</div>
        <div>Steps taken: {stepsTaken}</div>
        <div>Efficiency: {(100 * efficiency).toString().slice(0, 5)}%</div>
        <div className={style.tableAndButton}>
          {matrix && <table><tbody>{matrix.map((row, j) =>
            <tr key={j}>
              {row.map((col, i) =>
                <td key={i}>
                  {x === i && y === j ? 'O' : col}
                </td>)}
            </tr>
          )}</tbody></table>}
          <textarea onChange={this.onChangeMap} value={params.map}></textarea>
          <div className={style.coordinates}>
            <div>Start coordinates:</div>
            <div>X: <input onChange={this.onChangeX} value={params.x}></input></div>
            <div>Y: <input onChange={this.onChangeY} value={params.y}></input></div>
          </div>
          <button onClick={this.onClick}>Start</button>
          <div>{percentageCleaned === 1 && 'All clean!'}</div>
        </div>
      </div>
    );
  }
}

export default Home;
