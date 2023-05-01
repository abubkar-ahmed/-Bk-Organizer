import React, { useContext, useEffect, useState } from 'react'
import BoardSvg from '../svg/BoardSvg'
import HideSvg from '../svg/HideSvg'
import '../../style/aside/main-content.scss'
import { BoardContext } from '../../context/boardContext'
import CloseSvg from '../svg/CloseSvg';
import toast, { Toaster } from 'react-hot-toast';
import { nanoid } from 'nanoid'
import Login from '../authComponents/Login'
import Register from '../authComponents/Register'
import { AuthContext } from '../../context/AuthContext'
import Loading from '../Loading'

function AsideMainSection() {
    interface col {
        id : string,
        colName : string,
    }
    const {boards , addToLocalStorage , activeBoard , activeBoardHandler , addNewBoard} = useContext(BoardContext);
    const {isLoggedIn , user, logout , loadingRefresh} = useContext(AuthContext);
    const [boardName , setBoardName] = useState<string>('');
    const [showNew , setShowNew] = useState<boolean>(false);
    const [col , setCol] = useState<col[]>([{id : nanoid() , colName:''}]);
    const [showLogin , setShowLogin] = useState<boolean>(false)
    const [showSignUp , setShowSignUp] = useState<boolean>(false)

    const handleNewCol = () => {
        setCol(prevCol => {
            return [...prevCol , {id : nanoid() , colName :''}]
        });
        
    };


    const handleChangeCol =(e : React.ChangeEvent<HTMLInputElement>, index : string ) => {
        const { name, value } = e.target;
        setCol((prevState) => (
            prevState.map(h => {
                if(h.id === index){
                    h.colName = value;
                }
                return h
            })
        )) 
    }

    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setBoardName(e.target.value);
    }

    const handleRemove = (e:string) => {
        setCol(prev => {
            return prev.filter(h => {
                return h.id !== e ;
            })
        })
    }
    
    const submitHandler = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let hasEmpty :boolean = false;
        let exict = false

        boards.forEach(element => {
            if(element.name === boardName){
                toast.error(`Board Is Already Exict`);
                exict = true
            }
        });

        if(!exict){
            if(boardName){
                col.forEach(h => {
                    if(!hasEmpty){
                        if(!h.colName){
                            hasEmpty = true;
                            toast.error(`Please Fill All Columns Or Remove Empty Columns`);
                            return;
                        }
                    }
                });
                if(!hasEmpty) {
                    const id = nanoid()
                    if(isLoggedIn){
                        const response = await addNewBoard({
                            id:id,
                            name:boardName,
                            columns : col
                        })
                        if(response.status){
                            toast.success(response?.message)
                            setBoardName('');
                            setCol([{id : nanoid() , colName:''}]);
                        }else{
                            toast.error(response?.message)
                        }
                        setBoardName('');
                        setCol([{id : nanoid() , colName:''}]);
                    }else{
                        addToLocalStorage({
                            id : id,
                            name:boardName,
                            columns : col
                        });
                        toast.success("Board Added Successfully");
                        setBoardName('');
                        setCol([{id : nanoid() , colName:''}]);
                    }
                    setShowNew(false);
                }
            }else{
                toast.error('Please Add Board Name');
            }
        }


    }


  return (
    <>
    <section className='aside-main-content'>
        <h2>ALL BOARDS {`(${boards.length})`}</h2>
        <ul>
            {boards.map(e => {
                return (
                    <li key={e.id} className={e.name === activeBoard.name ? 'active' : ''} onClick={() => activeBoardHandler(e)}>
                        <BoardSvg/>
                        <span>{e.name}</span>
                    </li>
                )
            })}
        </ul>
        <div className="newBoard" onClick={() => setShowNew(true)}>
            <BoardSvg/>
            + Create New Board
        </div>
        <div className="hide">
            <HideSvg/>
            Hide Sidebar
        </div>
        {loadingRefresh ? (
            <div className="loading-auth">
                <Loading/>
            </div>
        ) : isLoggedIn ?(
            <div className="auth logged-in">
                <h3>@{user.userName}</h3>
                <button onClick={() => logout()}>
                    Logout
                </button>
            </div>
        ): (
            <div className="auth">
                <button className='login' onClick={() => setShowLogin(true)}>
                    Login
                </button>
                <button className='sign-up' onClick={() => setShowSignUp(true)}>
                    Register
                </button>
            </div>
        )}

    </section>
    {showNew && (
        <div className="back-drop-container" >
            <div className="control-div" onClick={() => setShowNew(false)}></div>
            <div className="inner-container">
                <h3>Add New Board</h3>
                <form onSubmit={submitHandler}>
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' id='name' onChange={handleNameChange} value={boardName}/>
                    <label htmlFor="col">Columns</label>
                    {col.map(e => {
                        return (
                            <div key={e.id}>
                                <input type="text" value={e.colName} name={`col-${e.id}`} onChange={(index) => handleChangeCol(index , e.id)}/>
                                {col.length > 1 && (
                                    <span onClick={() => handleRemove(e.id)}>
                                        <CloseSvg/>
                                    </span>
                                )}
                            </div>
                        )
                    })}
                    <button type='button'  onClick={handleNewCol} className='button-add-new-col'>
                        + Add New Column
                    </button>
                    <button type="submit">
                        Create New Board
                    </button>
                </form>
            </div>
        </div>
    )}
    {showLogin && (
        <Login setShowLogin={setShowLogin}/>
    )}
    {showSignUp && (
        <Register setShowSignUp={setShowSignUp} setShowLogin={setShowLogin}/>
    )}
    </>
  )
}

export default AsideMainSection




