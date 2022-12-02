import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle
} from "@material-ui/core";
import uniqueElementsArray_N1 from './data/data';
import Card from "./card";
import "./app.css";

function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}
export default function App() {
  const [cards, setCards] = useState(
    shuffleCards.bind(null, uniqueElementsArray_N1.concat(uniqueElementsArray_N1))
  );
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [showModalLost, setShowModalLost] = useState(false);

  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
  );
  
  const[hard,setHard]=useState(false)
  const[easy,setEasy]=useState(false)
  const[medium,setMedium]=useState(false)
  const[limit,setLimit]=useState()
  const [level,setLevel]=useState(1)

  const [isLost, setIsLost] = useState(false)
 const handelEasyClick=()=>{
  setLimit(25)
  setEasy(true) 
  setLevel(1)
  handleRestart()
 }
 const handelMediumClick=()=>{
  setLimit(18)
  setMedium(true) 
  setLevel(2)
  handleRestart()
 }
 const handelHardClick=()=>{
  setLimit(4)
  setHard(true) 
  setLevel(3)
  handleRestart()
 }


  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };
  const count_score = ()=>{

  }
  const checkCompletion = () => {

    if (Object.keys(clearedCards).length === uniqueElementsArray_N1.length) {
      setShowModal(true);
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem("bestScore", highScore);
    }
  };
  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].type === cards[second].type) {
      setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };
  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    // set a shuffled deck of cards
    setCards(shuffleCards(uniqueElementsArray_N1.concat(uniqueElementsArray_N1)));
  };
  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      if (moves+1>=limit){

        setIsLost(true)
        setShowModalLost(true)
        handleRestart()

      }

      setMoves((moves) => moves + 1);

      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };
  console.log(hard,easy,medium,limit)
  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);
  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.type]);
  };



  return (
    <div className="App">
      <header>
        <h3 className="title">Let's Play</h3>
        <div className="subtitle ">
          Select two cards with same content consequtively to make them vanish
        </div>
      </header>
      <div className="group_btn">
        <button className={`btnn ${level==1 && "focus"}`} onClick={handelEasyClick}>Easy</button>
        <button className={`btnn ${level==2 && "focus"}`} onClick={handelMediumClick}>Medium</button>
        <button className={`btnn ${level==3 && "focus"}`} onClick={handelHardClick}>Hard</button>
      </div>
      <div className="container">
        {cards.map((card, index) => {
          return (
            <Card
              key={index}
              card={card}
              index={index}
              isDisabled={shouldDisableAllCards}
              isInactive={checkIsInactive(card)}
              isFlipped={checkIsFlipped(index)}
              onClick={handleCardClick}
            />
          );
        })}
      </div>
      <footer>
        <div className="score">
          <div className="moves">
            <span className="bold">Moves:</span> {moves}
          </div>
          {localStorage.getItem("bestScore") && (
            <div className="high-score">
              <span className="bold">Best Score:</span> {bestScore}
            </div>
          )}
        </div>
        <div className="restart ">
          <button onClick={handleRestart} className="btn" variant="contained">
            Restart
          </button>
        </div>
      </footer>
      <Dialog
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hurray!!! You completed the challenge
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You completed the game in {moves} moves. Your best score is{" "}
            {bestScore} moves.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestart} color="primary">
            Restart
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showModalLost}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          You Lost
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You reached your maximum limit moves {limit}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setShowModalLost(false)} color="primary">
            Restart
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
