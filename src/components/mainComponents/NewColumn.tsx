import React, { useContext, useState } from 'react'
import { BoardContext, Column } from '../../context/boardContext'
import { toast } from 'react-hot-toast';
import { nanoid } from 'nanoid';
import CloseSvg from '../svg/CloseSvg';
import { AuthContext } from '../../context/AuthContext';
interface NewColumnProps {
    setShowNewColumn : React.Dispatch<React.SetStateAction<boolean>>
}
function NewColumn({setShowNewColumn} : NewColumnProps) {

    const {activeBoard , editLocalStorage , editedBoard} = useContext(BoardContext);
    const {isLoggedIn} = useContext(AuthContext);

    const [col , setCol] = useState<Column[]>(activeBoard.columns);
    const [boardName , setBoardName] = useState<string>(activeBoard.name);
    const [newCol , setNewCol] = useState<Column[]>([]);

    const handleChangeCol =(e : React.ChangeEvent<HTMLInputElement>, index : string ) => {
        const { name, value } = e.target;
        setNewCol((prevState) => (
            prevState.map(h => {
                if(h.id === index){
                    h.colName = value;
                }
                return h
            })
        )) 
    }

    const handleNewCol = () => {
        setNewCol(prevCol => {
            return [...prevCol , {id : nanoid() , colName :''}]
        });
        
    };

    const handleRemove = (e:string) => {
        setNewCol(prev => {
            return prev.filter(h => {
                return h.id !== e ;
            })
        })
    }

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let hasEmpty :boolean = false;

        if(newCol.length > 0){
            newCol.forEach(h => {
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
                        name : activeBoard.name,
                        columns : activeBoard.columns.concat(newCol)
                    })
                    if(response.status){
                        toast.success(`New Column${newCol.length > 1 ? 's' : ''} Added Successfully.`);
                        setShowNewColumn(false);
                    }else{
                        toast.error(response.message);
                    }
                }else{
                    editLocalStorage({
                        id : activeBoard.id,
                        name : activeBoard.name,
                        columns : activeBoard.columns.concat(newCol)
                    })
                    toast.success(`New Column${newCol.length > 1 ? 's' : ''} Added Successfully.`);
                    setShowNewColumn(false);
                }

            }
        }else{
            setShowNewColumn(false);
        }

    }   
  return (
    <div className="back-drop-container" >
        <div className="control-div" onClick={() => setShowNewColumn(false)}></div>
        <div className="inner-container edit">
                <h3>Add New Column</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' id='name' value={boardName} readOnly/>
                    <label htmlFor="col">Columns</label>
                    {col.map(e => {
                        return (
                            <div key={e.id}>
                                <input type="text" value={e.colName} name={`col-${e.id}`} readOnly/>
                            </div>
                        )
                    })}
                    {newCol.length > 0 && newCol.map(e => {
                        return (
                            <div key={e.id}>
                                    <input
                                    type="text"
                                    value={e?.colName}
                                    name={`col-${e.id}`}
                                    onChange={(index) => handleChangeCol(index, e.id)}
                                    ref={(input) => {
                                        if (input) {
                                        input.addEventListener("mousedown", (event) => {
                                            event.preventDefault();
                                            input.focus();
                                        });
                                        }
                                    }}
                                    />
                                    <span onClick={() => handleRemove(e.id)}>
                                        <CloseSvg/>
                                    </span>
                            </div>
                        )
                    })}
                    <button type='button'  onClick={handleNewCol} className='button-add-new-col'>
                        + Add New Column
                    </button>
                    <button type="submit">
                        Save
                    </button>
                </form>
        </div>
    </div>
  )
}

export default NewColumn