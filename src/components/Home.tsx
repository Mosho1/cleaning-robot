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

  render() {
    const { robotState, params } = this.props.appState;
    const { duration, startTimeString, tilesCleaned, tilesToClean, x, y, percentageCleaned, matrix } = robotState;
    return (
      <div className={style.home}>
        <h1>
          Welcome to CleanSim™!
        </h1>
        <div>Started at: {startTimeString}</div>
        <div>Duration: {duration}ms</div>
        <div>Tiles Cleaned: {tilesCleaned}/{tilesToClean}</div>
        <div>Percentage Cleaned: {(100 * percentageCleaned).toString().slice(0, 5)}%</div>
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
          <button onClick={this.onClick}>Start</button>
        </div>
      </div>
    );
  }
}

export default Home;
