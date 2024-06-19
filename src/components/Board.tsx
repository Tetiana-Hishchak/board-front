import React, { useState } from 'react';
import { CardList } from './CardList';
import { Board as BoardType } from '@/type/board';
import { AddCardForm } from './AddCardForm';
import styles from '../styles/style.module.css';
import { ColumnType } from '@/type/ColumnType';

interface BoardProps {
  column: ColumnType;
  showForm: string;
  boardId: string;
  onShowForm: (t: string) => void;
  onCardAdd: (boardId: string, title: string, description: string) => Promise<void>;
  onCardUpdate: (boardId: string, cardId: string, title: string, description: string) => void;
  onCardDelete: (boardId: string, cardId: string) => void;
}

export const Board: React.FC<BoardProps> = ({ 
  boardId, column, showForm, 
  onShowForm, onCardAdd, onCardUpdate, onCardDelete}) => {
  const handleAddCardClick = () => {
    onShowForm(boardId);
  };
  return (
    
    <>  
      <h3 className={styles.board__title}>{column.name}</h3>
      <div className={styles.board__container}>

        <div>
          <CardList
            cards={column.cards}
            boardId={boardId}
            onCardUpdate={onCardUpdate}
            onCardDelete={onCardDelete} />
        </div>
        {column.name === 'ToDo' && (
          <div className={styles.card__container}>
            {showForm === boardId  ? <AddCardForm 
              boardId={boardId}
              onCardAdd={onCardAdd} 
              onShowForm={onShowForm} 
            /> : (
              <button
                className={styles.button__add}
                onClick={handleAddCardClick}
              >
                +
              </button>
            )}
          </div>
        )}

      </div>
    </>
  );
};

