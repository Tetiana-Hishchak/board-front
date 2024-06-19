"use client";
import { useEffect, useState } from 'react';
import { Board as BoardComponent } from '../components/Board';
import * as api from '../services/api';
import { Card } from '@/type/card';
import { Board } from '@/type/board';
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import styles from '../styles/style.module.css';
import React from 'react';
import { Loader } from '../components/Loader';
import { CreateBoard } from '@/components/CreateBoard';


const Home = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [boardName, setBoardName] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [showForm, setShowForm] = useState('');
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      const boards = await api.getBoards();
      setBoards(boards);
    };
    fetchBoards();
  }, []);

  const handleCardAdd = async (boardId: string, title: string, description: string) => {
    if (!title.trim()) {
      console.error('Title cannot be empty');
      return;
    }
    const existingCard = cards.find(card => card.title === title);

    if (existingCard) {
      console.error('A card with this title already exists');
      return;
    }  
  
    return api.addCard(boardId, title, description)
    .then( (newCard) => {
      setCards((prevCards) => [...prevCards, newCard]);
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                columns: board.columns.map((column) =>
                  column.name === 'ToDo' ? { ...column, cards: [...column.cards, newCard] } : column
                )
              }
            : board
        )
      );
      setShowForm('');
    }).catch((error) => { console.error('Error adding card:', error);})
  };
  
  const handleCardMove = async (boardId: string, cardId: string, destinationColumnName: string) => {
    try {
      const updatedCard = await api.moveCard(boardId, cardId, destinationColumnName);
      setCards(prevCards => prevCards.map(card => card.id === cardId ? updatedCard : card));
    } catch (error) {
      console.error('Error moving card:', error);
    }
  };

  const handleCardUpdate = async (boardId: string, cardId: string, title: string, description: string) => {
    if (!title.trim()) {
      console.error('Title cannot be empty');
      return;
    }

    const existingCard = cards.find(card => card.title === title && card.id !== cardId);
    if (existingCard) {
      console.error('A card with this title already exists');
      return;
    }    
    
    try {
      const updatedCard = await api.updateCard(boardId, cardId, { title, description });
      setCards((prevCards) => 
        prevCards.map((card) => (card.id === cardId ? updatedCard : card))
      );
      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          columns: board.columns.map((column) => ({
            ...column,
            cards: column.cards.map((card) => (card.id === cardId ? updatedCard : card))
          }))
        }))
      );
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleCardDelete = async (boardId: string, cardId: string) => {
    try {
      await api.deleteCard(boardId, cardId);
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          columns: board.columns.map((column) => ({
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId)
          }))
        }))
      );      
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const searchBoard = () => {
    if (boardName.trim() === '') {
      setSelectedBoard(null);
    } else {
      const board = boards.find((item) => item.name.toUpperCase().includes(boardName.toUpperCase()));
      if (board) {
        setSelectedBoard(board);
      } else {
        alert('Invalid board name. Please enter a valid name (ToDo, In Progress, or Done).');
        setSelectedBoard(null)
      }
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceBoardIndex = boards.findIndex(board =>
      board.columns.some(column => column.id === source.droppableId)
    );
    const destinationBoardIndex = boards.findIndex(board =>
      board.columns.some(column => column.id === destination.droppableId)
    );

    const sourceBoard = boards[sourceBoardIndex];
    const destinationBoard = boards[destinationBoardIndex];

    const sourceColumn = sourceBoard.columns.find(column => column.id === source.droppableId);
    const destinationColumn = destinationBoard.columns.find(column => column.id === destination.droppableId);

    if (!sourceColumn || !destinationColumn) {
      return;
    }

    const [movedCard] = sourceColumn.cards.splice(source.index, 1);
    destinationColumn.cards.splice(destination.index, 0, movedCard);

    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.id === sourceBoard.id
          ? {
              ...board,
              columns: board.columns.map(column =>
                column.id === sourceColumn.id ? sourceColumn : column
              )
            }
          : board.id === destinationBoard.id
          ? {
              ...board,
              columns: board.columns.map(column =>
                column.id === destinationColumn.id ? destinationColumn : column
              )
            }
          : board
      )
    );

    const boardId = sourceBoard.id; 

    handleCardMove(boardId, movedCard.id, destinationColumn.id);
  };

  const clearInput = () => {
    setBoardName('');
  };

  const addBoard = async () => {
     if (newBoardName.trim() === '') {
      alert('Please enter a board name.');
      return;
    }

    const existingBoard = boards.find(board => board.name === newBoardName.trim());
    if (existingBoard) {
      alert('A board with this name already exists.');
      return;
    }
  
    setIsLoad(true);
    try {
      const createdBoard = await api.createBoard(newBoardName.trim());
      setBoards((prevBoards) => [...prevBoards, createdBoard]);
      setNewBoardName('');
      setIsCreatingBoard(false);
    } catch (error) {
      console.error('Error adding board:', error);
    } finally {
      setIsLoad(false);
    }
  };

  const editBoard = async (boardId: string, newBoardName: string) => {
    if (newBoardName.trim() === '') {
      alert('Please enter a board name.');
      return;
    }
  
    const existingBoard = boards.find(board => board.name === newBoardName.trim());
    if (existingBoard) {
      alert('A board with this name already exists.');
      return;
    }
  
    setIsLoad(true);
    setSelectedBoardId(boardId);
    try {
      const updatedBoard = await api.updateBoard(boardId, newBoardName.trim());
      setBoards((prevBoards) => prevBoards.map(board => 
        board.id === boardId ? updatedBoard : board
      ));
      alert('Board updated successfully.');
    } catch (error) {
      console.error('Error editing board:', error);
    } finally {
      setIsLoad(false);
      setSelectedBoard(null)
    }
  };
  

  const deleteBoard = async (boardId: string) => {  
    setIsLoad(true);
    try {
      await api.deleteBoard(boardId);
      setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId));
    } catch (error) {
      console.error('Error deleting board:', error);
    } finally {
      setIsLoad(false);
    }
  };
  
  const handleEditClick = (board: Board) => {
    setSelectedBoardId(board.id);
    setNewBoardName(board.name);
    setIsEditing(true);
  };

  const handleSaveClick = async (board: Board) => {
    await editBoard(board.id, newBoardName);
    setIsEditing(false);
  };

  const handleCancelClick = (board: Board) => {
    setNewBoardName(board.name);
    setIsEditing(false);
  };
  return (
    <div className={styles.main}>
      <div style={{ display: 'flex' }}>
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
      
      {isCreatingBoard ? (
        <CreateBoard 
          newBoardName={newBoardName} 
          onChangeName={setNewBoardName}
          onCreateBoard={addBoard} 
        />
      ) : (
        <button className={styles.button} onClick={() => setIsCreatingBoard(true)}>
          Create Board
        </button>
      )}
      
      {isLoad && selectedBoard ? <Loader /> : (
        boardName && selectedBoard ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.board}>
              <div className={styles.boardContainer}>
                {selectedBoard.columns.map(column => (
                  <Droppable key={column.id} droppableId={column.id}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <BoardComponent
                          key={column.id}
                          column={column}
                          showForm={showForm}
                          boardId={selectedBoard.id}
                          onShowForm={setShowForm}
                          onCardAdd={(boardId, title, description) => handleCardAdd(boardId, title, description)}
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
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            {boards.map(board => (
              <div className={styles.board} key={board.id}>
                <div className={styles.board__titleContainer}>
                {isEditing && selectedBoardId === board.id ? (
                  <div className={styles.board__editForm}>
                    <input
                      type="text"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      className={styles.input}
                    />
                    <button className={styles.button} onClick={()=>handleSaveClick(board)}>
                      Save
                    </button>
                    <button className={styles.button} onClick={()=>handleCancelClick(board)}>
                      Cancel
                    </button>
                  </div>
              ) : (
                  <>
                    <h2 className={styles.board__title}>Board name: {board.name}</h2>
                    <div>
                      <button className={styles.button} onClick={()=>handleEditClick(board)}>
                        Edit board
                      </button>
                      <button className={styles.button} onClick={() => deleteBoard(board.id)}>
                        Delete board
                      </button>
                    </div>
                  </>
                )}
      
                </div>
                <div className={styles.boardContainer}>
                  {board.columns.map(column => (
                    <Droppable key={column.id} droppableId={column.id}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          <BoardComponent
                            key={column.id}
                            column={column}
                            boardId={board.id}
                            showForm={showForm}
                            onShowForm={setShowForm}
                            onCardAdd={(boardId, title, description) => handleCardAdd(boardId, title, description)}
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
            ))}
          </DragDropContext>
        )
      )}
    </div>
  );
};

export default Home;
