import React from 'react';
import { Card as CardComponent } from './Card';
import { Card as CardType } from '../type/card';
import { Draggable } from '@hello-pangea/dnd';
import styles from '../styles/style.module.css';

interface CardListProps {
  cards: CardType[];
  boardId: string;
  onCardUpdate: (boardId: string, cardId: string, title: string, description: string) => void;
  onCardDelete: (boardId: string, cardId: string) => void;
}

export const CardList: React.FC<CardListProps> = ({ cards, boardId, onCardUpdate, onCardDelete }) => {
  return (
    <div>
      {cards.map((card, index) => (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={styles.card__container}
            >
              <CardComponent
                card={card}
                boardId={boardId}
                onUpdate={onCardUpdate}
                onDelete={onCardDelete}
              />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};
