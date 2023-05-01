import { nanoid } from 'nanoid';
import React, { useContext, useState } from 'react'
import { BoardContext, Column } from '../../context/boardContext';
import CloseSvg from '../svg/CloseSvg';
import ArrowSvg from '../svg/ArrowSvg';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

interface AddNewTaskProps {
  showNewTask: boolean;
  setShowNewTask: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SubTask {
  id: string;
  status: boolean;
  title: string;
}

interface FormState {
  title: string;
  description: string;
}

function AddNewTask({ showNewTask, setShowNewTask }: AddNewTaskProps) {
    const {activeBoard , addNewTaskToLocalStorage, addNewTask} = useContext(BoardContext);
    const {isLoggedIn} = useContext(AuthContext);
    const {columns} = activeBoard
    const [selectedCol , setSelectedCol] = useState<Column>(columns[0]);
    const [showStatus , setShowStatus] = useState<boolean>(false); 
    
    const [formState, setFormState] = useState<FormState>({ title: '', description: '' });

    const [subT , setSubT] = useState<SubTask[]>([{id : nanoid() ,status:false , title : ''}]);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { title, description } = formState;
      let hasEmpty :boolean = false;
      if(title){
          subT.forEach(h => {
              if(!hasEmpty){
                  if(!h.title){
                      hasEmpty = true;
                      toast.error(`Please Add Atleast One SubTasks Or Remove Empty Ones`);
                      return;
                  }
              }
          });
          if(!hasEmpty) {
            if(isLoggedIn){
              const response = await addNewTask(activeBoard.id , selectedCol.id , {
                title : title,
                desc : description,
                subTasks : subT,
                id:nanoid()
              })
              if(response.status){
                toast.success(response.message);
              }else{
                toast.error(response.message);
              }
            }else{
              addNewTaskToLocalStorage({
                title : title,
                desc : description,
                id:nanoid(),
                subTasks : subT
              },selectedCol)
            }
            setShowNewTask(false);
          }
      }else{
        toast.error(`Please Add Title To The Task`);
      }
      
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    };

    const handleNewSubT = () => {
        setSubT(prevSubT => {
            return [...prevSubT , {id : nanoid() ,status:false , title : ''}]
        });
    };

    const handleChangeCol =(e : React.ChangeEvent<HTMLInputElement>, index : string ) => {
        const { name, value } = e.target;
        setSubT((prevState) => (
            prevState.map(h => {
                if(h.id === index){
                    h.title = value;
                }
                return h
            })
        )) 
    }

    const handleRemove = (e:string) => {
        setSubT(prev => {
            return prev.filter(h => {
                return h.id !== e ;
            })
        })
    }


    const handleNewStatus = (e:Column) => {
      setSelectedCol(e);
      setShowStatus(false)
    }

  return (
    <div className="back-drop-container">
      <div className="control-div" onClick={() => setShowNewTask(false)}></div>
      <div className="inner-container new-task">
        <h3>Add New Task</h3>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" value={formState.title} onChange={handleInputChange} />
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" value={formState.description} onChange={handleInputChange} />

          <label htmlFor="col">SubTasks</label>
            {subT.map(e => {
                return (
                    <div key={e.id}>
                        <input type="text" value={e.title} name={`col-${e.id}`} onChange={(index) => handleChangeCol(index , e.id)}/>
                        {subT.length > 1 && (
                            <span onClick={() => handleRemove(e.id)}>
                                <CloseSvg/>
                            </span>
                        )}
                    </div>
                )
            })}
            <button type='button'  onClick={handleNewSubT} className='button-add-new-col'>
                + Add New SubTask
            </button>
            <div className="select-wrapper">
                <label>Status</label>
                <div className="selected" onClick={() => setShowStatus(prev => !prev)}>
                  {selectedCol.colName}
                  <ArrowSvg/>
                </div>
                {showStatus && (
                <ul className="options">
                  {columns.map(e => {
                  return (
                    <li key={e.id} onClick={() => handleNewStatus(e)} >
                      {e.colName}
                    </li>
                  )

                  })}
                </ul>

                )}
            </div>
          <button type="submit">Create Task</button>
        </form>
      </div>
      {/* <Toaster
        toastOptions={{
            className: '',
            style: {
            padding: '16px',
            color: 'white',
            backgroundColor:'#20212c'
            },
        }}
      /> */}
    </div>
  )
}

export default AddNewTask;

