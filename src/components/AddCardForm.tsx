// /components/AddCardForm.tsx
import React, { useState } from 'react';
import styles from '../styles/style.module.css';
import { Loader } from './Loader';

interface AddCardFormProps {
  boardId: string;
  onShowForm: (t:string) => void
  onCardAdd: (boardId: string, title: string, description: string) => Promise<void>;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({boardId, onCardAdd, onShowForm }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onCardAdd(boardId, title, description).finally( () =>{
      setTitle('');
      setDescription('');
      setIsLoading(false);
    })    
  };

  const handleCancelAdd = (e: React.FormEvent) => {
    onShowForm(boardId);
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
        disabled={isLoading}
      />
      <textarea
        className={styles.form__input}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        disabled={isLoading}
      />
      <div className={styles.card__buttons}>
        <button type="submit" className={styles.card__button}>Add Card</button>
        <button className={styles.card__button} onClick={handleCancelAdd}>Cancel</button>
      </div>
      {isLoading && <Loader />}
    </form>
  );
};
