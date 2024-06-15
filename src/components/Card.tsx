import React, { useState } from 'react';
import { Card as CardType } from '../type/card';
import styles from '../styles/style.module.css';
import Image from 'next/image';

interface CardProps {
  card: CardType;
  onUpdate: (cardId: string, title: string, description: string) => void;
  onDelete: (cardId: string) => void;
}

export const Card: React.FC<CardProps> = ({ card, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(card.title);
    setEditedDescription(card.description);
  };

  const handleSave = () => {
    onUpdate(card.id, editedTitle, editedDescription);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <div>
          <div>
            Title: 
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            /> 
          </div>
          <div>
            Description: 
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
          </div>
          
          <button className={styles.card__button} onClick={handleSave}>Save</button>
          <button className={styles.card__button} onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <>
          <h4>{card.title}</h4>
          <p>{card.description}</p>
          <div className={styles.card__buttons}>
            <button className={`${styles.card__button} ${styles.card__edit}`} onClick={handleEdit}>
              <Image src="/image/edit.svg" alt="edit" width={20} height={20} />
            </button>            
            <button className={`${styles.card__button} ${styles.card__delete}`} onClick={() => onDelete(card.id)}>
              <Image src="/image/delete.svg" alt="delete" width={20} height={20} />
            </button>
          </div>
        </>
      )}
    </>
  );
};
