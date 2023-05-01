import { nanoid } from 'nanoid';
import React, { FormEvent, useContext, useState } from 'react'
import { BoardContext } from '../../context/boardContext';
import CloseSvg from '../svg/CloseSvg';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

interface EditBoardProps {
    showEdit: boolean;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

interface col {
    id : string,
    colName : string,
}

function EditBoard({showEdit, setShowEdit}: EditBoardProps) {
    const {activeBoard , editLocalStorage , boards , editedBoard} = useContext(BoardContext);
    const {isLoggedIn} = useContext(AuthContext);
    const [col , setCol] = useState<col[]>(activeBoard.columns);
    const [boardName , setBoardName] = useState<string>(activeBoard.name);

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


    const handleNewCol = () => {
        setCol(prevCol => {
            return [...prevCol , {id : nanoid() , colName :''}]
        });
        
    };

    const handleRemove = (e:string) => {
        setCol(prev => {
            return prev.filter(h => {
                return h.id !== e ;
            })
        })
    }

    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setBoardName(e.target.value);
    }

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let hasEmpty :boolean = false;
        let exict : boolean = false;

        boards.forEach(element => {
            if(element.name === boardName && element.name !== activeBoard.name){
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
                            toast.error(`Please Fill All Columns Or Remove Empty Columns.`);
                            return;
                        }
                    }
                });
                if(!hasEmpty) {
                    if(isLoggedIn){
                        const response = await editedBoard({
                            id : activeBoard.id,
                            name : boardName,
                            columns:col
                        })
                        if(response.status){
                            toast.success(response.message);
                        }else{
                            toast.error(response.message);
                        }
                    }else{
                        editLocalStorage({
                            id : activeBoard.id,
                            name:boardName,
                            columns : col
                        });
                        toast.success("Board Edited Succeffuly.");
                    }
                    setShowEdit(false);
                }
            }else{
                toast.error('Board Name Can Not Be Empty.');
            }
        }
    }   

  return (
    <div className="back-drop-container" >
        <div className="control-div" onClick={() => setShowEdit(false)}></div>
        <div className="inner-container edit">
                <h3>Edit Board</h3>
                <form onSubmit={handleSubmit}>
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
                        Save Changes
                    </button>
                </form>
        </div>
    </div>
  )
}

export default EditBoard