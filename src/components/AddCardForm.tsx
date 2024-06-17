// /components/AddCardForm.tsx
import React, { useState } from 'react';
import styles from '../styles/style.module.css';

interface AddCardFormProps {
  onShowForm: (t:boolean) => void
  onCardAdd: (title: string, description: string) => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({onCardAdd, onShowForm }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCardAdd(title, description);
    setTitle('');
    setDescription('');
  };

  const handleCancelAdd = (e: React.FormEvent) => {
    onShowForm(false);
  };
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.form__input}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className={styles.form__input}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <div className={styles.card__buttons}>
        <button type="submit" className={styles.card__button}>Add Card</button>
        <button className={styles.card__button} onClick={handleCancelAdd}>Cancel</button>
      </div>
    </form>
  );
};
