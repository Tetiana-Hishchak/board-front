import React, { ChangeEvent, useState } from 'react';
import styles from '../styles/style.module.css';
import { Loader } from './Loader';
import { strict } from 'assert';

interface CreateBoardProps {
  newBoardName: string;
  onChangeName: (name: string) => void;
  onCreateBoard: (name: string) => Promise<void>;
}

export const CreateBoard: React.FC<CreateBoardProps> = ({ newBoardName, onChangeName, onCreateBoard }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateBoard = () => {
    if (newBoardName.trim() === '') {
      alert('Please enter a board name.');
      return;
    }
    setIsLoading(true);
    onCreateBoard(newBoardName).finally( () =>{
      onChangeName('');
      setIsLoading(false);
    })  
  };


  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeName(e.target.value);
};

  return (
    <div className={styles.createBoardForm}>
      <input
        type="text"
        placeholder="Name board"
        value={newBoardName}
        onChange={handleChangeName}
        className={styles.input}
      />
      {isLoading ? <Loader /> : (
        <button className={styles.button} onClick={handleCreateBoard}>
          Create board
        </button>
      )}
    </div>
  );
};
