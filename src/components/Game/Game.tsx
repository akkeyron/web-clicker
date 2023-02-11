import { useState, useRef, useEffect, FC, CSSProperties, MouseEventHandler, FormEvent } from "react";
import './Game.css'
import CatDefault from "../../assets/default1.png"
import CatOpen from "../../assets/open1.png"
import axios from 'axios';

// set the game time limit
const TIME_LIMIT = 5
const api_endpoint: string = "https://g1bme0lzz2.execute-api.ap-southeast-1.amazonaws.com/dev/score";

// interface
interface Props {
    currentScore: string;
}

// data interface
interface IData {
    name: string;
    score: string;
}

const Game: FC<Props> = ({ currentScore }) => {
    const [score, setScore] = useState(0);
    const [newHighScore, setNewHighScore] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [buttonStyles, setButtonStyles] = useState<CSSProperties>({});
    const [gameStarted, setGameStarted] = useState(false);
    const [catState, setCatState] = useState(CatDefault);

    // Use a ref to get the dimensions of the container div
    const containerRef = useRef<HTMLDivElement>(null);
    const endtime = useRef(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const interval = useRef<NodeJS.Timeout | null>(null);
    const catRef = useRef(CatDefault);

    const handleClick: MouseEventHandler<HTMLDivElement> = () => {
        setScore(prevScore => prevScore + 1);
        // Get the dimensions of the container div

        const container = containerRef.current;

        // check if the container is null or undefined
        if (container === undefined || container === null) {
            return;
        }

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        // Generate a random position for the button within the container div
        const maxX = containerWidth - 153;
        const maxY = containerHeight - 50;
        const newX = Math.floor(Math.random() * maxX);
        const newY = Math.floor(Math.random() * maxY);
        // Update the button's styles to move it to the new position
        setButtonStyles({
            position: "absolute",
            left: `${newX}px`,
            top: `${newY}px`
        });
    };

    useEffect(() => {
        // game ends
        if (timeLeft <= 0) {
            endtime.current = false;

            // delete interval when game ends
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
            endGame();
        };
    }, [timeLeft])

    function startGame(): void {
        setGameStarted(true);
        endtime.current = true;

        const start = performance.now();
        // play the game time limit
        interval.current = setInterval(() => {
            // delete interval if its endtime
            if (endtime.current === false) {
                clearInterval(interval.current!);
                interval.current = null;
            };

            // make sure the time interval is in 1 second
            const elapsed = performance.now() - start;
            setTimeLeft(() => {
                return TIME_LIMIT - Math.floor(elapsed / 1000)
            });

        }, 1000);
    };

    const endGame = (): void => {
        setGameStarted(false);
        if (Number(score) > Number(currentScore)) {
            setNewHighScore(true);
        }
        setScore(0);
        setTimeLeft(TIME_LIMIT);
        endtime.current = false;
    }

    const handleHighscore = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newData: IData = {
            'score': String(score),
            'name': nameRef.current === null ? "Unknown" : nameRef.current?.value,
        }

        axios.put(api_endpoint, newData)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setScore(0);
                setNewHighScore(false);
            });
    }

    console.log(catState);

    return (
        <section id='game'>
            <div className="container game__container" ref={containerRef}>
                {/* game menu */}
                <div className="game__menu">
                    Score: {score}
                    {gameStarted && <p>Time left: {timeLeft}</p>}
                    {!gameStarted && <button onClick={startGame}>Start</button>}

                </div>

                {/* game starts and click the cat */}
                {gameStarted && <div id="clicker" onClick={handleClick} style={buttonStyles}>
                    <img src={catState}
                        onTouchStart={() => setCatState(CatOpen)}
                        onTouchEnd={() => setCatState(CatDefault)}
                        onMouseOver={() => setCatState(CatOpen)}
                        onMouseOut={() => setCatState(CatDefault)}

                        alt="Imagine this is cat"
                    />
                </div>}

                {/* game ends and get new high score */}
                {!gameStarted && newHighScore &&
                    <>
                        <h1>High score poggers!</h1>
                        <form>
                            <input type="text" ref={nameRef} placeholder="enter your name" />
                            <button type="submit">Submit</button>
                        </form>

                    </>

                }


            </div>

        </section>

    );
}


export default Game