import { FC } from 'react';
import "./Board.css"
import { DynamoDB } from 'aws-sdk';

interface Props {
  table: DynamoDB.DocumentClient.ItemList;
  loading: boolean;
}

const Board:FC<Props> = ({ table, loading }) => {
  return (
    <section id="board">
      <div className='container board__container'>
        <h1>Leaderboard</h1>
        <table className='board__table'>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {loading ? "loading...." : table.map((highScore, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{highScore.name}</td>
                <td>{highScore.score}</td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>
    </section>

  )
}

export default Board