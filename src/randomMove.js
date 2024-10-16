import { useState } from 'react';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
              
function RandomMoveGenerator() {
  const [game, setGame] = useState(new Chess());
//Let's perform a function on the game state 
 
function safeGameMutate(modify){
  setGame((g)=>{
    const update = {...g}
    modify(update)
    return update;
  })
}
//Movement of computer
function makeRandomMove(){
  const possibleMove = game.moves();

  //exit if the game is over 

  if(game.game_over() || game.in_draw() || possibleMove.length === 0) return;
  //select random move

  const randomIndex = Math.floor(Math.random() * possibleMove.length);
 //play random move 
 safeGameMutate((game)=>{
  game.move(possibleMove[randomIndex]);
 })
}

//Perform an action when a piece is droped by a user
 
function onDrop(source,target){
  let move = null;
  safeGameMutate((game)=>{
    move = game.move({
      from:source,
      to: target,
      promotion:'q'
    })
})
 //illegal move 
 if(move== null) return false
 //valid move 
 setTimeout(makeRandomMove, 200);
 return true;
}
  return (
      <Chessboard 
      position={game.fen()}
      onPieceDrop ={onDrop}
      boardWidth={550}
      customBoardStyle={{
        borderRadius: '10px',
        boxShadow: '0px 5px 15px rgba(0,0,0,0.5)',
      }}
      customDarkSquareStyle={{ backgroundColor: '#EBECD0', color: '#779556' }} // Dark square color
      customLightSquareStyle={{ backgroundColor: '#779556', color: '#EBECD0' }} // Light square color
      />
  );
}

export default RandomMoveGenerator;