import React, { useState } from 'react';
import { CardList } from './CardList';
import { Board as BoardType } from '@/type/board';
import { AddCardForm } from './AddCardForm';
import styles from '../styles/style.module.css';

interface BoardProps {
  board: BoardType;
  showForm: boolean;
  onShowForm: (t: boolean) => void;
  onCardAdd: (title: string, description: string) => void;
  onCardUpdate: (cardId: string, title: string, description: string) => void;
  onCardDelete: (cardId: string) => void;
}

export const Board: React.FC<BoardProps> = ({ board, showForm, onShowForm, onCardAdd, onCardUpdate, onCardDelete }) => {
  const handleAddCardClick = () => {
    onShowForm(true);
  };
  return (
    <>
      <h3 className={styles.board__title}>{board.name}</h3>
      <div className={styles.board__container}>
        <div>
          <CardList
            cards={board.cards}
            onCardUpdate={onCardUpdate}
            onCardDelete={onCardDelete} />
        </div>
        {board.name === 'ToDo' && (
          <div className={styles.card__container}>
            {showForm ? <AddCardForm onCardAdd={onCardAdd} onShowForm={onShowForm} /> : (
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

