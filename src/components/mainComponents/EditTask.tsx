import React, { useContext, useEffect, useState } from 'react'
import { BoardContext, Column, SubTask, Task } from '../../context/boardContext'
import { nanoid } from 'nanoid';
import CloseSvg from '../svg/CloseSvg';
import { Toaster, toast } from 'react-hot-toast';
import ArrowSvg from '../svg/ArrowSvg';
import CheckSvg from '../svg/CheckSvg';
import { AuthContext } from '../../context/AuthContext';
interface EditTaskProps {
  showEditTask : boolean,
  setShowEditTask : React.Dispatch<React.SetStateAction<boolean>>,
  setShowTaskOption : React.Dispatch<React.SetStateAction<boolean>>,
  boardId : string,
  columnId : string,
  taskId : string
}

interface FormState {
  title: string;
  description: string;
}

function EditTask({showEditTask , setShowEditTask,setShowTaskOption , boardId , columnId , taskId} : EditTaskProps) {

  const {activeBoard , editTask , editTaskReq} = useContext(BoardContext);
  const {isLoggedIn} = useContext(AuthContext);
  const [currentTask , setCurrentTask] = useState<Task>({
    id : '',
    title : '',
    desc : '',
    subTasks : []
  })

  const {columns} = activeBoard
  const [selectedCol , setSelectedCol] = useState<Column>(columns[0]);
  const [showStatus , setShowStatus] = useState<boolean>(false); 
  
  const [formState, setFormState] = useState<FormState>({ title: currentTask.title, description: currentTask.desc });

  const [subT , setSubT] = useState<SubTask[]>(currentTask.subTasks);

  useEffect(() => {
    activeBoard.columns.forEach(element => {
      if(element.id === columnId){
        setSelectedCol(element);
        element?.tasks?.forEach(e => {
          if(e.id === taskId){
            setCurrentTask(e);
          }
        });
      }
    })
  },[activeBoard]);

  useEffect(() => {
    setFormState({
      title : currentTask.title,
      description:currentTask.desc
    });
    setSubT(currentTask.subTasks);
  },[currentTask]);

  


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
            const response = await editTaskReq(boardId , selectedCol.id , columnId,{
              id : currentTask.id,
              title : title,
              desc : description,
              subTasks : subT
            })
            if(response.status){
              toast.success(response.message);
              setShowEditTask(false);
              setShowTaskOption(false);
            }else{
              toast.error(response.message);
            }
            
          }else{
            editTask(boardId , selectedCol.id, columnId , {
              id : currentTask.id,
              title : title,
              desc : description,
              subTasks : subT
            });
            toast.success('Task Edited Successfuly.')
            setShowEditTask(false);
          }

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

  const handleSubTaskStatus = (subtTaskId : string) => {
    setSubT(prev => {
      return prev.map(e => {
        if(e.id === subtTaskId){
          return {...e , status : !e.status}
        }
        return e
      })
    })
  }
  
  return (
    <div className="back-drop-container">
      <div className="control-div" onClick={() => setShowEditTask(false)}></div>
      <div className="inner-container new-task edit-task">
        <h3>Edited Task</h3>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" value={formState.title} onChange={handleInputChange} />
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" value={formState.description} onChange={handleInputChange} />

          <label htmlFor="col">SubTasks</label>
            {subT.map(e => {
                return (
                    <div key={e.id} className='sub-task'>
                          <span className={e.status ? 'status done' : 'status'} onClick={() => handleSubTaskStatus(e.id)}>
                                {e.status && <CheckSvg/>}
                          </span>
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
    </div>
  )
}

export default EditTask