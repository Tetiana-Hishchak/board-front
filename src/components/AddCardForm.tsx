// /components/AddCardForm.tsx
import React, { useState } from 'react';

interface AddCardFormProps {
  onCardAdd: (title: string, description: string) => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({onCardAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCardAdd(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Add Card</button>
    </form>
  );
};
