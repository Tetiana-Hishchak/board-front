"use client";
import { useEffect, useState } from 'react';
import { Board as BoardComponent } from '../components/Board';
import * as api from '../services/api';
import { Card } from '@/type/card';
import { Board } from '@/type/board';
import { DragDropContext, Droppable, DropResult } from  "@hello-pangea/dnd";
import styles from '../styles/style.module.css';
import React from 'react';
import { BoardName } from '@/type/BoardName';

const Home = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [boardName, setBoardName] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      const boards = await api.getBoards();
      setBoards(boards);
    };
    fetchBoards();
  }, []);

  const handleCardAdd = async (title: string, description: string) => {
    try {
      const newCard = await api.addCard(title, description);
      setCards(prevCards => [...prevCards, newCard]);
      setBoards(prevBoards => prevBoards.map(board => 
        board.name === 'ToDo' ? { ...board, cards: [...board.cards, newCard] } : board
      ));
      setShowForm(false);
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };
  
  const handleCardMove = async (cardId: string, boardId: string) => {
    try {
      const column = await api.getBoardById(boardId);
      const updatedCard = await api.moveCard(cardId, column.name);
      setCards(prevCards => prevCards.map(card => card.id === cardId ? updatedCard : card));
    } catch (error) {
      console.error('Error moving card:', error);
    }
  };

  const handleCardUpdate = async (cardId: string, title: string, description: string) => {
    try {
      const updatedCard = await api.updateCard(cardId, { title, description });
      setCards(prevCards => prevCards.map(card => card.id === cardId ? updatedCard : card));
      setBoards(prevBoards => prevBoards.map(board => ({
        ...board,
        cards: board.cards.map(card => card.id === cardId ? updatedCard : card)
      })));
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };  

  const handleCardDelete = async (cardId: string) => {
    try {
      await api.deleteCard(cardId);
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
      setBoards(prevBoards => prevBoards.map(board => ({
        ...board,
        cards: board.cards.filter(card => card.id !== cardId)
      })));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  
  const searchBoard = () => {
    if (boardName.trim() === '') {
      setSelectedBoard(null);
    } else {
      const board = boards.find(item => item.name.toLocaleUpperCase().includes(boardName.toLocaleUpperCase()));
      if (board) {
        setSelectedBoard(board);
      } else {
        alert('Invalid board name. Please enter a valid name (ToDo, In Progress, or Done).');
        setSelectedBoard(null);
      }
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const sourceBoardIndex = boards.findIndex(board => board.id === source.droppableId);
    const destinationBoardIndex = boards.findIndex(board => board.id === destination.droppableId);

    const sourceBoard = boards[sourceBoardIndex];
    const destinationBoard = boards[destinationBoardIndex];

    const [movedCard] = sourceBoard.cards.splice(source.index, 1);
    destinationBoard.cards.splice(destination.index, 0, movedCard);
    handleCardMove(movedCard.id, destination.droppableId);
  };

  const clearInput = () => {
    setBoardName('');
  };

  return (
    <div className={styles.main}>
      <div style={{display:'flex'}}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            id="searchInput"
            placeholder="Enter a board name here..."
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className={styles.input}
          />
        
          {boardName && (
            <span className={styles.clearButton} onClick={clearInput}>
              &times;
            </span>
          )}
        </div>
       
        <button
          className={styles.button}
          onClick={searchBoard}
        >
          Load
        </button>
      </div>
      {boardName && selectedBoard ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.board}>
            <div className={styles.boardContainer}>    
              <Droppable key={selectedBoard.id} droppableId={selectedBoard.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <BoardComponent
                      key={selectedBoard.id}
                      board={selectedBoard}
                      showForm={showForm}
                      onShowForm={setShowForm}
                      onCardAdd={(title, description) => handleCardAdd(title, description)}
                      onCardUpdate={handleCardUpdate}
                      onCardDelete={handleCardDelete} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      ) : (      
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.board}>
            <div className={styles.boardContainer}>
              {boards.map(board => (
                <Droppable key={board.id} droppableId={board.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <BoardComponent
                        key={board.id}
                        board={board}
                        showForm={showForm}
                        onShowForm={setShowForm}
                        onCardAdd={(title, description) => handleCardAdd(title, description)}
                        onCardUpdate={handleCardUpdate}
                        onCardDelete={handleCardDelete}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </DragDropContext>
      )}  
    </div>
  );
};

export default Home;