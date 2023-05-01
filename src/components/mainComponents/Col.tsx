import React, { useState } from 'react'
import {Column, Task } from '../../context/boardContext';
import DropBackTask from './DropBackTask';
import EditTask from './EditTask';

interface ColProps {
    e: Column;
}


function Col({e}: ColProps) {    
    const [showTaskOption , setShowTaskOption] = useState<boolean>(false);
    const [task , setTask] = useState<string>('')
    const [activeColomnId , setActiveColumnId] = useState<string>('');


    const handleShowTask = (h:Task , columnId : string) => {
        setTask(h.id);
        setActiveColumnId(columnId)
        setShowTaskOption(prev => !prev);
    }


  return (
    <>
        <h3>
            <span></span>
            {`${e.colName} (${e.tasks?.length ? e.tasks.length : 0})`} 
        </h3>
        {e.tasks?.length ? (
            e.tasks.map(h => {
                let finshedTasks : number = 0;
                h?.subTasks?.forEach(element => {
                    if(element.status === true){
                        finshedTasks +=1
                    }
                });
                return (
                <div className="tasks-container" key={h.id} onClick={() => handleShowTask(h , e.id)}>
                    <h4>{h?.title}</h4>
                    <p>{finshedTasks} of {h.subTasks?.length} subtasks</p>
                </div>
                )
            })
        ): (
            <div className="emity">
                
            </div>
        )}
        {showTaskOption && (
            <DropBackTask showTaskOption={showTaskOption} setShowTaskOption={setShowTaskOption} taskId={task} columnId={activeColomnId}/>
        )}
    </>
  )
}

export default Col

