import React, { useState } from 'react';
import { Card as CardType } from '../type/card';
import styles from '../styles/style.module.css';
import Image from 'next/image';
import { Loader } from './Loader';

interface CardProps {
  card: CardType;
  boardId: string;
  onUpdate: (boardId: string, cardId: string, title: string, description: string) => void;
  onDelete: (boardId: string, cardId: string) => void;
}

export const Card: React.FC<CardProps> = ({ card, boardId, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState('');

  const handleEdit = () => {
    setIsEditing(true);    
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(card.title);
    setEditedDescription(card.description);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSelectedCardId(card.id);
    await onUpdate(boardId, card.id, editedTitle, editedDescription);
    setIsLoading(false);
    setIsEditing(false);
    setSelectedCardId('');
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setSelectedCardId(card.id);
    await onDelete(boardId, card.id);
    setIsLoading(false);
    setSelectedCardId('');
  };

  return (
    <>
      {isEditing ? (
        <div>
          <div>
            Title: 
            <input
              className={styles.form__input}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            /> 
          </div>
          <div>
            Description: 
            <textarea
              className={styles.form__input}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
          </div>
          
          {isLoading ? <Loader /> : (
            <>
              <button className={styles.card__button} onClick={handleSave}>Save</button>
              <button className={styles.card__button} onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      ) : (
        <>
          {(isLoading && (selectedCardId === card.id)) ? <Loader /> : (
            <>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
              <div className={styles.card__buttons}>
                <button className={`${styles.card__button} ${styles.card__edit}`} onClick={handleEdit}>
                  <Image src="/image/edit.svg" alt="edit" width={20} height={20} />
                </button>
                <button className={`${styles.card__button} ${styles.card__delete}`} onClick={handleDelete}>
                  <Image src="/image/delete.svg" alt="delete" width={20} height={20} />
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

