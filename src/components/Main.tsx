import React, { useContext, useState } from 'react'
import '../style/main/main.scss'
import Col from './mainComponents/Col'
import ScrollContainer from 'react-indiana-drag-scroll'
import { BoardContext } from '../context/boardContext'
import NewColumn from './mainComponents/NewColumn'
// import NewColumn from './mainComponents/newColumn'


function Main() {
    const {activeBoard} = useContext(BoardContext);
    const [showNewColumn , setShowNewColumn] = useState<boolean>(false);
  return (
    <ScrollContainer 
        className="scroll-container"
        hideScrollbars={false}
        component='main'
        horizontal={true}
        vertical={true}
        >
            {activeBoard?.columns?.map(e => {
                return (
                    <div className="column" key={e.id}>
                        <Col e={e}/>
                    </div>
                )
            })}
        <div className="new-col" onClick={() => setShowNewColumn(prev => !prev)}>
            + New Column
        </div>
        {showNewColumn && <NewColumn setShowNewColumn={setShowNewColumn}/>}
    </ScrollContainer> 
  )
}

export default Main