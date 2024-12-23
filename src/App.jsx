import React, {useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';
import {
  addTodo,
  deleteTodo,
  markComplete,
  deleteCompletedTodo,
  editTodo,
} from './context/todoSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FixedSizeList } from 'react-window'; 


function App() {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const allTodos = useSelector((state) => state.todos.allTodos);
  const completedTodos = useSelector((state) => state.todos.completedTodos);
  const dispatch = useDispatch();

  const handleAddTodo = useCallback(() => {
    if (newTitle && newDescription) {
      dispatch(addTodo({ title: newTitle, description: newDescription }));
      setNewTitle('');
      setNewDescription('');
    }
  }, [newTitle, newDescription, dispatch]);


  const handleEdit = useCallback((index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  }, []);

   const handleUpdateToDo = () => {
    if (currentEdit !== null) {
      dispatch(editTodo({ index: currentEdit, updatedItem: currentEditedItem }));
      setCurrentEdit("");
      setCurrentEditedItem("");
      
    }
  };

  const handleComplete = useCallback(
    (index) => {
      const now = new Date();
      const completedOn = now.toLocaleString();
      dispatch(markComplete({ index, completedOn }));
    },
    [dispatch]
  );


  

  return (
    <div>
      <h1>My Todos</h1>
      <div className="bg-[#353434] p-4 w-fit mx-auto mt-12 max-h-[80vh] overflow-y-auto shadow-[0px_5px_7px_rgb(27,27,27)]">
        {/* Input Sections */}
        <div className="flex items-center justify-center border-b border-gray-700 pb-6 mb-6">
          <div className="flex flex-col items-start mr-6">
            <label className='font-bold text-white'>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add title"
              className='p-2 w-[250px] border-none focus:outline focus:outline-2 focus:outline-[#00e67a]'
            />
          </div>
          <div className="flex flex-col items-start mr-6">
            <label className='font-bold text-white'>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Add description"
              className='p-2 w-[250px] border-none focus:outline focus:outline-2 focus:outline-[#00e67a]'
            />
          </div>
          <button
            type="button"
            onClick={handleAddTodo}
            className="bg-[#00e67a] text-white mt-6 p-2 w-[60px] cursor-pointer hover:bg-[#04c46a]"
          >
            Add
          </button>
        </div>
  
        {/* Toggle Buttons */}
        <div className="mb-4">
          <button
            className={`bg-gray-700 text-white p-2 w-fit cursor-pointer hover:bg-[rgb(4,_196,_106)] ${!isCompleteScreen ? 'bg-[#00e67a]' : ''}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`bg-gray-700 text-white p-2 w-fit cursor-pointer hover:bg-[rgb(4,_196,_106)] ${isCompleteScreen ? 'bg-[#00e67a]' : ''}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>
  
        {/* Todo List Section */}
        <div className="todo-list-wrapper">
          {!isCompleteScreen && (
            <FixedSizeList
              height={500}
              itemCount={allTodos.length}
              itemSize={80}
              width="100%"
            >
              {({ index, style }) => {
                const item = allTodos[index];
                return (
                  <div
                    className="bg-[#414040] flex justify-between items-center p-6 mb-3 shadow-[0px_3px_5px_rgb(43,42,42)]"
                    style={style}
                  >
                    {currentEdit === index ? (
                      <div className="flex flex-col">
                        <input
                          className="border p-2 mb-2 rounded"
                          placeholder="Updated Title"
                          value={currentEditedItem?.title}
                          onChange={(e) =>
                     
                            setCurrentEditedItem({
                            ...currentEditedItem,
                            title: e.target.value,
                          })}
                        />
                        <textarea
                          className="border p-2 mb-2 rounded"
                          placeholder="Updated Description"
                          rows={4}
                          value={currentEditedItem?.description}
                          onChange={(e) =>  setCurrentEditedItem((prev)=>{
                            return {...prev,description:e.target.value}
                          })}
                        />
                        <button
                          type="button"
                          onClick={handleUpdateToDo}
                          className="bg-[#00e67a] text-white p-2 rounded hover:bg-[#04c46a]"
                        >
                          Update
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-[#00e67a] font-bold m-0">{item.title}</h3>
                        <p className="text-gray-400 mt-2">{item.description}</p>
                        <AiOutlineDelete
                          className="text-[#00e67a] cursor-pointer ml-2"
                          onClick={() => dispatch(deleteTodo(index))}
                          title="Delete"
                        />
                        <BsCheckLg
                          className="text-[#00e67a] cursor-pointer ml-2"
                          onClick={() => handleComplete(index)}
                          title="Complete"
                        />
                        <AiOutlineEdit
                          className="text-[#00e67a] cursor-pointer ml-2"
                          onClick={() => handleEdit(index, item)}
                          title="Edit"
                        />
                      </>
                    )}
                  </div>
                );
              }}
            </FixedSizeList>
          )}
  
          {/* Completed Todos */}
          {isCompleteScreen &&
            completedTodos.map((item, index) => (
              <div
                key={index}
                className="bg-[#414040] flex justify-between items-center p-6 mb-3 shadow-[0px_3px_5px_rgb(43,42,42)]"
              >
                <h3 className="text-[#00e67a] font-bold m-0">{item.title}</h3>
                <p className="text-gray-400 mt-2">{item.description}</p>
                <small className="text-[#00e67a] font-bold">Completed on: {item.completedOn}</small>
                <AiOutlineDelete
                  className="text-[#00e67a] cursor-pointer ml-2"
                  onClick={() => dispatch(deleteCompletedTodo(index))}
                  title="Delete"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
  
  
}

export default App;

