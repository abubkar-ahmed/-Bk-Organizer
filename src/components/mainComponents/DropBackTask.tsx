import React, { useContext, useEffect, useState } from 'react'
import { BoardContext, SubTask, Task } from '../../context/boardContext';
import CheckSvg from '../svg/CheckSvg';
import EditTask from './EditTask';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface DropBackProps {
    showTaskOption : boolean,
    setShowTaskOption : React.Dispatch<React.SetStateAction<boolean>>,
    taskId : string,
    columnId : string,
}

function DropBackTask({showTaskOption , setShowTaskOption , taskId , columnId } : DropBackProps) {
    const {activeBoard , editSubTaskStatus , deleteTask , deleteTaskReq,editeSubTasksReq} = useContext(BoardContext);
    const {isLoggedIn} = useContext(AuthContext);
    const [task , setTask] = useState<Task>({
        id:'',
        title : '',
        desc : '',
        subTasks : []
    });
    const [showTaskControls , setShowTaskControls] = useState<boolean>(false);
    const [showDeleteMsg , setShowDeleteMsg] = useState<boolean>(false);
    const [showEditTask , setShowEditTask] = useState<boolean>(false);

    useEffect(() => {
        activeBoard.columns.map(e => {
            if(e.id === columnId){
                e?.tasks?.map(h => {
                    if(h.id === taskId){
                        setTask(h);
                    }
                    return h
                })
            }
            return e;
        })
    },[activeBoard])

    let finshedTasks : number = 0;
    task.subTasks.forEach(element => {
        if(element.status === true){
            finshedTasks +=1
        }
    });

    
    const handleSubTaskStatus = async (e:SubTask) => {
        if(isLoggedIn){
            const response = await editeSubTasksReq(activeBoard.id , columnId , task.id , e.id);
            if(!response.status){
                toast.error(response.message);
            }
        }else{
            editSubTaskStatus(activeBoard.id,columnId , task.id , e.id)
        }
    }

    const handleDelete = async () => {
        if(isLoggedIn){
            const response = await deleteTaskReq(activeBoard.id , columnId , task.id)
            if(response.status){
                toast.success(response.message);
            }else{
                toast.error(response.message);
            }
        }else{
            deleteTask(activeBoard.id , columnId , task.id);
        }
        setShowDeleteMsg(false);
        setShowTaskControls(false);
        setShowTaskOption(false);
    }

    const editTaskHandler = () => {
        setShowEditTask(true)
    }

    return (
        <>
        {showDeleteMsg ? (
        <div className="back-drop-container" >
            <div className="control-div" onClick={() => setShowDeleteMsg(false)}></div>
            <div className="inner-container delete">
                <h3>Delete This Task ?</h3>
                <p>
                    {`Are you sure you want to delete the '${task.title}' task? This action will remove all columns and tasks and cannot be reversed.`}
                </p>
                <div className="delete-controls">
                    <button onClick={handleDelete}>Delete</button>
                    <button onClick={() => setShowDeleteMsg(false)}>Cancel</button>
                </div>
            </div>
        </div>
        ) : (
        <div className="back-drop-container" >
            <div className="control-div" onClick={() => setShowTaskOption(false)}></div>
            <div className="inner-container task">
                <h4>{task.title}</h4>
                <p>{task.desc}</p>
                <h5>Subtasks({finshedTasks} of {task.subTasks.length})</h5>
                <ul>
                    {task.subTasks.map(e => {
                        return (
                            <li key={e.id} className={e.status ? 'done' : ''} onClick={() => handleSubTaskStatus(e)}>
                                <span>
                                    {e.status && <CheckSvg/>}
                                </span>
                                {e.title}
                            </li>
                        )
                    })}
                </ul>
                <div className="dots" onClick={() => setShowTaskControls(prev => !prev)}>
                    <span></span>
                    <span></span>
                    <span></span>
                    {showTaskControls && (
                        <div className="controls">
                                <button onClick={editTaskHandler}>Edit Task</button>
                                <button onClick={() => {
                                    setShowDeleteMsg(prev => !prev)
                                }}>Delete Task</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        )}
        {showEditTask && (
            <EditTask showEditTask={showEditTask} setShowEditTask={setShowEditTask} boardId={activeBoard.id} columnId={columnId} taskId={task.id} setShowTaskOption={setShowTaskOption}/>
        )}
        </>
    )
}

export default DropBackTask