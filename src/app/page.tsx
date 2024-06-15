"use client";
import { useEffect, useState } from 'react';
import { Board as BoardComponent } from '../components/Board';
import * as api from '../services/api';
import { Card } from '@/type/card';
import { Board } from '@/type/board';
import { DragDropContext, Droppable, DropResult } from  "@hello-pangea/dnd";
import styles from '../styles/style.module.css';
import React from 'react';
// import { withDefaultProps } from 'with-default-props'
// const Droppable = React.memo(function Droppable({ children = null }) {
//   return <div>{children}</div>;
// });

const Home = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      const boards = await api.getBoards();
      setBoards(boards);
    };
    fetchBoards();
  }, []);

  const handleCardAdd = async (title: string, description: string) => {
    try {
      const newCard = await api.addCard(title, description);
      setCards(prevCards => [...prevCards, newCard]);
      setBoards(prevBoards => prevBoards.map(board => 
        board.name === 'ToDo' ? { ...board, cards: [...board.cards, newCard] } : board
      ));
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };
  
  const handleCardMove = async (cardId: string, boardId: string) => {
    try {
      const column = await api.getBoardById(boardId);
      const updatedCard = await api.moveCard(cardId, column.name);
      setCards(prevCards => prevCards.map(card => card.id === cardId ? updatedCard : card));
    } catch (error) {
      console.error('Error moving card:', error);
    }
  };
  
  // const handleCardMove = async (cardId: string, boardId: string) => {
  //   try {
  //     const updatedCard = await api.moveCard(cardId, { boardId });
  //     setCards(prevCards => prevCards.map(card => card.id === cardId ? updatedCard : card));
  //     setBoards(prevBoards => prevBoards.map(board => ({
  //       ...board,
  //       cards: board.cards.map(card => card.id === cardId ? updatedCard : card)
  //     })));
  //   } catch (error) {
  //     console.error('Error moving card:', error);
  //   }
  // };

  const handleCardUpdate = async (cardId: string, title: string, description: string) => {
    try {
      const updatedCard = await api.updateCard(cardId, { title, description });
      setCards(prevCards => prevCards.map(card => card.id === cardId ? updatedCard : card));
      setBoards(prevBoards => prevBoards.map(board => ({
        ...board,
        cards: board.cards.map(card => card.id === cardId ? updatedCard : card)
      })));
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };  

  const handleCardDelete = async (cardId: string) => {
    try {
      await api.deleteCard(cardId);
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
      setBoards(prevBoards => prevBoards.map(board => ({
        ...board,
        cards: board.cards.filter(card => card.id !== cardId)
      })));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const sourceBoardIndex = boards.findIndex(board => board.id === source.droppableId);
    const destinationBoardIndex = boards.findIndex(board => board.id === destination.droppableId);

    const sourceBoard = boards[sourceBoardIndex];
    const destinationBoard = boards[destinationBoardIndex];

    const [movedCard] = sourceBoard.cards.splice(source.index, 1);
    destinationBoard.cards.splice(destination.index, 0, movedCard);

    // setBoards([
    //   ...boards.slice(0, sourceBoardIndex),
    //   sourceBoard,
    //   ...boards.slice(sourceBoardIndex + 1, destinationBoardIndex),
    //   destinationBoard,
    //   ...boards.slice(destinationBoardIndex + 1),
    // ]);

    handleCardMove(movedCard.id, destination.droppableId);
    console.log(destination);
  };

  return (
    <div className={styles.main}>
      <div>
        <input 
         type="text" id="searchInput" placeholder="Enter a board ID here..."
         className={styles.input}
        />
        <button className={styles.button}> Load </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.board}>
          <div className={styles.boardContainer}>
            {boards.map(board => (
              <Droppable key={board.id} droppableId={board.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <BoardComponent
                      key={board.id}
                      board={board}
                      onCardAdd={(title, description) => handleCardAdd(title, description)}
                      onCardUpdate={handleCardUpdate}
                      onCardDelete={handleCardDelete}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Home;



//   const [boards, setBoards] = useState<Board[]>([]);
//   const [errorMessage, setErrorMessage] = useState(ErrorMessages.EMPTY);
  
//   useEffect(() => {
//     const fetchBoards = async () => {
//       const data = await api.getBoards();
//       setBoards(data);
//       // console.log(boards);
//     };

//     fetchBoards();
//   }, []);

//   const addCard = ({
//     title, description,
//   }: Omit<Card, "id">) => {
//     setErrorMessage(ErrorMessages.EMPTY);
//     const newCard: Card = {
//       id: (boards.reduce((max, board) => Math.max(max, ...board.cards.map(c => parseInt(c.id))), 0) + 1).toString(),
//       title,
//       description,
//       column: 'ToDo' as Column,
//     };

//     return  api.addCard ({ title, description})
//       .then((newCard) => 
//         setBoards(prevBoards =>
//         prevBoards.map(board =>
//           board.name === 'ToDo'? { ...board, cards: [...board.cards, newCard] } : board
//         )))
//       .catch((error) => {
//         setErrorMessage(ErrorMessages.ADD);
//         throw error;
//       })
//       .finally(() => {
//       });
//   };

//   // const updateTodo = (updatedTodo: Todo) => {
//   //   setErrorMessage(ErrorMessages.EMPTY);
//   //   setIsLoadingId(updatedTodo.id);
//   //   setLoadingIds(current => [
//   //     ...current,
//   //     updatedTodo.id,
//   //   ]);

//   //   return todosService.updateTodo(updatedTodo)
//   //     .then(todo => {
//   //       setTodos(currentTodos => {
//   //         const newPosts = [...currentTodos];
//   //         const index = newPosts.findIndex(post => post.id === updatedTodo.id);

//   //         newPosts.splice(index, 1, todo);

//   //         return newPosts;
//   //       });
//   //     })
//   //     .catch((error) => {
//   //       setErrorMessage(ErrorMessages.UPDATE);
//   //       throw error;
//   //     })
//   //     .finally(() => {
//   //       setLoadingIds(current => current.filter(id => id !== updatedTodo.id));
//   //       setIsLoadingId(null);
//   //     });
//   // };
  
//   const updateCard = (boardId: string, cardId: string, title: string, description: string, column: Column) => {
//     setBoards(prevBoards =>
//       prevBoards.map(board =>
//         board.id === boardId
//           ? {
//               ...board,
//               cards: board.cards.map(card =>
//                 card.id === cardId ? { ...card, title, description, column } : card
//               ),
//             }
//           : board
//       )
//     );
//   };

//   const deleteCard = (boardId: string, cardId: string) => {
//     setBoards(prevBoards =>
//       prevBoards.map(board =>
//         board.id === boardId
//           ? { ...board, cards: board.cards.filter(card => card.id !== cardId) }
//           : board
//       )
//     );
//   };

//   return (
//     <div>
//       <h1>Boards</h1>
//       <div style={{ display: 'flex', gap: '20px' }}>
//         {boards.map(board => (
//           <div key={board.id} style={{ border: '1px solid #ccc', padding: '20px', width: '300px' }}>
//             <h2>{board.name}</h2>
//             {columns.map(column => (
//               <div key={column}>
//                 <h3>{column}</h3>
//                 {board.cards
//                   .filter(card => card.column === column)
//                   .map(card => (
//                     <div key={card.id} style={{ border: '1px solid #000', margin: '5px', padding: '10px' }}>
//                       <h4>{card.title}</h4>
//                       <p>{card.description}</p>
//                       <button onClick={() => deleteCard(board.id, card.id)}>Delete</button>
//                       <button onClick={() => updateCard(board.id, card.id, card.title, card.description, 'ToDo')}>Move to ToDo</button>
//                       <button onClick={() => updateCard(board.id, card.id, card.title, card.description, 'In Progress')}>Move to In Progress</button>
//                       <button onClick={() => updateCard(board.id, card.id, card.title, card.description, 'Done')}>Move to Done</button>
//                     </div>
//                   ))}
//               </div>
//             ))}
//             <AddCardForm boardId={board.id} addCard={addCard} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// interface AddCardFormProps {
//   boardId: string;
//   addCard: (boardId: string, title: string, description: string) => void;
// }

// const AddCardForm: React.FC<AddCardFormProps> = ({ boardId, addCard }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     addCard(boardId, title, description);
//     setTitle('');
//     setDescription('');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h4>Add Card</h4>
//       <div>
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit">Add Card</button>
//     </form>
//   );
// };

// export default Home;

// async function getBoards(): Promise<Board[]> {
//   // Це функція-заглушка, замініть її реальним API викликом
//   return [
//     {
//       id: '1',
//       name: 'Project A',
//       cards: [
//         { id: '1', title: 'Task 1', description: 'Description 1', column: 'ToDo' },
//         { id: '2', title: 'Task 2', description: 'Description 2', column: 'In Progress' },
//       ],
//     },
//   ];



// export default function Home() {
//   const [boards, setBoards] = useState<Board[]>([]);

//   useEffect(() => {
//     const fetchBoards = async () => {
//       const data = await getBoards();
//       setBoards(data);
//       // console.log(boards);
//     };

//     fetchBoards();
//   }, []);

//   const addCard = (boardId, title, description) => {
//     const newCard = {
//       id: (boards.reduce((max, board) => Math.max(max, ...board.cards.map(c => parseInt(c.id))), 0) + 1).toString(),
//       title,
//       description,
//       column: 'ToDo',
//     };
//     setBoards(prevBoards =>
//       prevBoards.map(board =>
//         board.id === boardId ? { ...board, cards: [...board.cards, newCard] } : board
//       )
//     );
//   };

//   // Update card in a board
//   const updateCard = (boardId, cardId, title, description, column) => {
//     setBoards(prevBoards =>
//       prevBoards.map(board =>
//         board.id === boardId
//           ? {
//               ...board,
//               cards: board.cards.map(card =>
//                 card.id === cardId ? { ...card, title, description, column } : card
//               ),
//             }
//           : board
//       )
//     );
//   };

//   // Delete card from a board
//   const deleteCard = (boardId, cardId) => {
//     setBoards(prevBoards =>
//       prevBoards.map(board =>
//         board.id === boardId
//           ? { ...board, cards: board.cards.filter(card => card.id !== cardId) }
//           : board
//       )
//     );
//   };

//   return (
//     <div>
//       <h1>Boards</h1>
//       <div style={{ display: 'flex', gap: '20px' }}>
//         {boards.map(board => (
//           <div key={board.id} style={{ border: '1px solid #ccc', padding: '20px', width: '300px' }}>
//             <h2>{board.name}</h2>
//             {columns.map(column => (
//               <div key={column}>
//                 <h3>{column}</h3>
//                 {board.cards
//                   .filter(card => card.column === column)
//                   .map(card => (
//                     <div key={card.id} style={{ border: '1px solid #000', margin: '5px', padding: '10px' }}>
//                       <h4>{card.title}</h4>
//                       <p>{card.description}</p>
//                       <button onClick={() => deleteCard(board.id, card.id)}>Delete</button>
//                       <button onClick={() => updateCard(board.id, card.id, card.title, card.description, 'ToDo')}>Move to ToDo</button>
//                       <button onClick={() => updateCard(board.id, card.id, card.title, card.description, 'In Progress')}>Move to In Progress</button>
//                       <button onClick={() => updateCard(board.id, card.id, card.title, card.description, 'Done')}>Move to Done</button>
//                     </div>
//                   ))}
//               </div>
//             ))}
//             <AddCardForm boardId={board.id} addCard={addCard} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function AddCardForm({ boardId: string, addCard }) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addCard(boardId, title, description);
//     setTitle('');
//     setDescription('');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h4>Add Card</h4>
//       <div>
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit">Add Card</button>
//     </form>
//   );
// }


//   return (
//     <div className={styles.container}>
//       <h1>Boards</h1>
//       <button onClick={handleCreateBoard}>Create Board</button>
//       <div className={styles.boards}>
//         {boards.map((board) => (
//           <a key={board.id} href={`/board/${board.id}`} className={styles.boardLink}>
//             {board.name}
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   return (
//     <main className={styles.main}>
//       <div className={styles.description}>
//         <p>
//           Get started by editing&nbsp;
//           <code className={styles.code}>src/app/page.tsx</code>
//         </p>
//         <div>
//           <a
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{" "}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className={styles.vercelLogo}
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className={styles.center}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className={styles.grid}>
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Docs <span>-&gt;</span>
//           </h2>
//           <p>Find in-depth information about Next.js features and API.</p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Learn <span>-&gt;</span>
//           </h2>
//           <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Templates <span>-&gt;</span>
//           </h2>
//           <p>Explore starter templates for Next.js.</p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Deploy <span>-&gt;</span>
//           </h2>
//           <p>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   );
// }
