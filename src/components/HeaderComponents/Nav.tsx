import React, { useContext, useEffect, useRef, useState } from 'react'
import { BoardContext } from '../../context/boardContext';
import '../../style/header/nav.scss'
import AddNewTask from './AddNewTask';
import EditBoard from './EditBoard';
import ArrowSvg from '../svg/ArrowSvg';
import PlusSvg from '../svg/PlusSvg';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

function Nav() {
    const [showControls , setShowControls] = useState<boolean>(false);
    const {activeBoard , removeFromLocalStorage , showAsideMain , setShowAsideMain , deleteBoard} = useContext(BoardContext);
    const {isLoggedIn} = useContext(AuthContext);
    const [showDelete , setShowDelete] = useState<boolean>(false);
    const handleDelete = async () => {
        if(isLoggedIn){
            const response = await deleteBoard(activeBoard.id);
            if(response.status){
                toast.success(response.message);
            }else{
                toast.error(response.message);
            }
        }else{
            removeFromLocalStorage(activeBoard.id);
        }
        setShowDelete(false);
    }

    const [showEdit , setShowEdit] = useState<boolean>(false);
    const [showNewTask , setShowNewTask] = useState<boolean>(false);

    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
      function handleResize() {
        setScreenWidth(window.innerWidth);
      }
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

  return (
    <nav>
        {activeBoard?.name ? (
            screenWidth > 768 ? (
                <h1>
                    {activeBoard.name.length > 15 ? (
                        activeBoard.name.slice(0,15)+'...'
                    ): (
                        activeBoard.name
                    )}
                </h1>
            ) : (
                <h1 onClick={() => setShowAsideMain(e => !e)} className={showAsideMain ? 'active' : ''}>
                    {activeBoard.name.length > 10 ? (
                        activeBoard.name.slice(0,10)+'...'
                    ): (
                        activeBoard.name
                    )}
                    <ArrowSvg/>
                </h1>
            )
        ) : (
            <h1>
                No Board Found
            </h1>
        )}
        {activeBoard?.name && (
            <div className="board-controls">
                <button className='add-new' onClick={() => setShowNewTask(true)}> {screenWidth > 768 ? '+Add New task' : <PlusSvg/>}</button>
                <div className="dots" onClick={() => setShowControls(prev => !prev)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                {showControls && (
                    <div className="controls">
                        <button onClick={() => setShowEdit(true)}>Edit Board</button>
                        <button onClick={() => setShowDelete(true)}>Delete Board</button>
                    </div>
                )}
            </div>
        )}
        {showDelete && (
            <div className="back-drop-container" >
                <div className="control-div" onClick={() => setShowDelete(false)}></div>
                <div className="inner-container delete">
                    <h3>Delete This Board ?</h3>
                    <p>
                        {`Are you sure you want to delete the '${activeBoard?.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
                    </p>
                    <div className="delete-controls">
                        <button onClick={handleDelete}>Delete</button>
                        <button onClick={() => setShowDelete(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        )}
        {showEdit && (
            <EditBoard showEdit={showEdit} setShowEdit={setShowEdit}/>
        )}
        {showNewTask && (
            <AddNewTask showNewTask={showNewTask} setShowNewTask={setShowNewTask} />
        )}
    </nav>
  )
}

export default Nav

