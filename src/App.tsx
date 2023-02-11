import { useState, useRef, FC } from 'react'
import GamePlayer from './components/Game/Game';
import Board from './components/Board/Board';
import { useQuery } from 'react-query';
import axios from 'axios';
import { DynamoDB } from 'aws-sdk';

const api_endpoint: string = "https://g1bme0lzz2.execute-api.ap-southeast-1.amazonaws.com/dev/score";

interface IData {
  id: string;
  name: string;
  score: string
}

const App: FC = () => {
  const [highScores, setHighScores] = useState<DynamoDB.DocumentClient.ItemList>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const currentScore = useRef<string>('0');
  const tableLength = useRef<number>(0);

  // react-query part
  // const { data, status, error } = useQuery("highscores", async () => {
  //   setLoading(true);
  //   const { data } = await axios.get(api_endpoint);

  //   // if table empty
  //   if (data === undefined) {
  //     return;
  //   }

  //   // get list of all data
  //   const sortedData: IData[] = data.Items.sort((a: IData, b: IData) => Number(b.score) - Number(a.score));
  //   setHighScores(sortedData);

  //   // get the lowest score
  //   currentScore.current = sortedData[sortedData.length - 1].score;

  //   setLoading(false)
  // });

  // if (status === 'error') {
  //   console.log(error);
  // }

  return (
    <>
      {loading ? "" : <GamePlayer
        currentScore={currentScore.current}
      />}
      {loading ? "" : <Board
        table={highScores}
        loading={loading}
      />}

    </>
  )
}

export default App