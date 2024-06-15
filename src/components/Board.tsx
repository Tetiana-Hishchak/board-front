import React from 'react';
import { CardList } from './CardList';
import { Board as BoardType } from '@/type/board';
import { AddCardForm } from './AddCardForm';
import styles from '../styles/style.module.css';

interface BoardProps {
  board: BoardType;
  onCardAdd: (title: string, description: string) => void;
  onCardUpdate: (cardId: string, title: string, description: string) => void;
  onCardDelete: (cardId: string) => void;
}

export const Board: React.FC<BoardProps> = ({ board, onCardAdd, onCardUpdate, onCardDelete }) => {
  return (
    <div className={styles.board__container}>
      <div> 
        <h3>{board.name}</h3>       
        <CardList
          cards={board.cards}
          onCardUpdate={onCardUpdate}
          onCardDelete={onCardDelete}
        />     
      </div>
      {board.name === 'ToDo' && <AddCardForm onCardAdd={onCardAdd} /> }
    </div>
  );
};

