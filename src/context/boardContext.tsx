import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
// import { AxiosStatic } from 'axios';
import axios,{ AxiosStatic } from 'axios';

type BoardContextType = {
  activeBoard: Board;
  boards: Board[];
  showAsideMain : boolean;
  setShowAsideMain : React.Dispatch<React.SetStateAction<boolean>>,
  setUpLocalStorage: (status? : Board) => void;
  addToLocalStorage: (newBoard : Board) => void;
  activeBoardHandler: (board : Board) => void;
  removeFromLocalStorage: (selectedBoardIs : string) => void;
  editLocalStorage: (editedBoard : Board) => void;
  addNewTaskToLocalStorage: (task : Task , column : Column) => void;
  editSubTaskStatus: (boardId : string,columnId : string , taskId : string , subTaskId : string) => void;
  deleteTask: (boardId : string,columnId : string , taskId : string) => void;
  editTask: (boardId : string,columnId : string, prevColumnId : string , task:Task) => void;
  getAllBoards: () => void;
  addNewBoard: (board: Board) => Promise<{ status: boolean; message: string }>;
  editedBoard: (board: Board) => Promise<{ status: boolean; message: string }>;
  deleteBoard: (boardId: string) => Promise<{ status: boolean; message: string }>;
  addNewTask: (boardId: string , columnId :string , task : Task) => Promise<{ status: boolean; message: string }>;
  deleteTaskReq: (boardId: string , columnId :string , taskId : string) => Promise<{ status: boolean; message: string }>;
  editeSubTasksReq: (boardId: string , columnId :string , taskId : string , subTaskId : string) => Promise<{ status: boolean; message: string }>;
  editTaskReq: (boardId: string , columnId :string, prevColumnId : string , task : Task) => Promise<{ status: boolean; message: string }>;
  boardLoading : boolean;
}

export const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export interface SubTask {
  id:string,
  status: boolean,
  title : string
}
export interface Task {
  id:string,
  title : string,
  desc : string,
  subTasks : SubTask[]
}

export interface Column {
  id: string;
  colName: string;
  tasks? : Task[]
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

type AuthContextProviderProps = {
  children: ReactNode;
};

const BoardContextProvider = ({ children }: AuthContextProviderProps) => {

  const {user} = useContext(AuthContext);
  const [activeBoard, setActiveBoard] = useState<Board>({
    id: '',
    name: '',
    columns: [],
  });

  const [boards, setBoards] = useState<Board[]>([]);

  const [showAsideMain , setShowAsideMain] = useState<boolean>(false);

  const [boardLoading , setBoardLoadin] = useState<boolean>(false)


  
  // Local Storage

  const setUpLocalStorage = (selectedActiveBoard? : Board) => {
    const localBoards = window.localStorage.getItem('boards');
    if(!localBoards){
      const newBoards :Board[] = []
      window.localStorage.setItem('boards' ,JSON.stringify(newBoards))
    }else{
      const newBoards : Board[] = JSON.parse(localBoards);
      setBoards(newBoards);
      if(!selectedActiveBoard){
        activeBoardHandler(newBoards[0]);
      }else{
        activeBoardHandler(selectedActiveBoard)
      }
    }
    
  }

  const addToLocalStorage = (newBoards : Board) => {
    let oldLocal = window.localStorage.getItem('boards');
    if (oldLocal) {
      let oldLocalpers: Board[] = JSON.parse(oldLocal);
      oldLocalpers.push(newBoards);
      window.localStorage.setItem('boards', JSON.stringify(oldLocalpers));
      setUpLocalStorage(newBoards);
    }
  };

  const activeBoardHandler = (board : Board) => {
    setActiveBoard(board);
  }

  const editLocalStorage = (editedBoard : Board) => {
    let localBoard = window.localStorage.getItem('boards');
    if(localBoard) {
      let localBoardPres : Board[] = JSON.parse(localBoard);
      const editedBoards = localBoardPres.map(e => {
        if(e.id === editedBoard.id){
          return {
            id : e.id,
            name: editedBoard.name,
            columns : editedBoard.columns
          }
        }
        return e
      })
      window.localStorage.setItem('boards', JSON.stringify(editedBoards));
      setUpLocalStorage(editedBoard);
    }
    
  }

  const removeFromLocalStorage = (selectedBoardId : string) => {
    let localBoard = window.localStorage.getItem('boards');
    if(localBoard) {
      let localBoardPres : Board[] = JSON.parse(localBoard);
      const filterdBoards = localBoardPres.filter(e => {
        return e.id !== selectedBoardId
      })
      window.localStorage.setItem('boards', JSON.stringify(filterdBoards));
      setUpLocalStorage();
    }
  }

  const addNewTaskToLocalStorage = (task :Task , column : Column) => {
    let localBoard = window.localStorage.getItem('boards');
    if(localBoard) {
      let localBoardPres : Board[] = JSON.parse(localBoard);
      const addingTaskToBoard = activeBoard.columns.map(e => {
        if(e.id === column.id){
          return {
            id : e.id,
            colName : e.colName,
            tasks : e.tasks ? [
              ...e.tasks , {
                id :task.id,
                title : task.title,
                desc : task.desc,
                subTasks : task.subTasks
              }
            ] : [
              {
                id :task.id,
                title : task.title,
                desc : task.desc,
                subTasks : task.subTasks
              }
            ]
          }
        }
        return e
      });


      const finalBoard : Board = {
        id : activeBoard.id,
        name : activeBoard.name,
        columns : addingTaskToBoard,
      }
      
      const finalBoards = localBoardPres.map(e => {
        if(e.id === activeBoard.id){
          return finalBoard;
        }
        return e
      });

      window.localStorage.setItem('boards', JSON.stringify(finalBoards));
      setUpLocalStorage(finalBoard);
    }
  }


  const editSubTaskStatus = (boardId: string, columnId: string, taskId: string, subTaskId: string) => {

    // Get the board from local storage
    const localBoard = window.localStorage.getItem('boards');

    // If a board exists in local storage
    if (localBoard) {

      // Parse the board as a Board array
      const localBoardPres: Board[] = JSON.parse(localBoard);

      // Map over each board object and check if the board id matches the given boardId parameter
      let newActive : Board = activeBoard
      const editedBoards = localBoardPres.map(board => {
        if (board.id === boardId) {

          // If the board id matches, map over each column and check if the column id matches the given columnId parameter
          const columns = board.columns.map(column => {
            if (column.id === columnId) {

              // If the column id matches, map over each task and check if the task id matches the given taskId parameter
              const tasks = column.tasks?.map(task => {
                if (task.id === taskId) {

                  // If the task id matches, map over each subTask and check if the subTask id matches the given subTaskId parameter
                  const subTasks = task.subTasks.map(subTask => {
                    if (subTask.id === subTaskId) {

                      // If the subTask id matches, return a new object with the same properties as the original subTask object, but with the status property inverted
                      return { ...subTask, status: !subTask.status };
                    }
                    return subTask;
                  });

                  // Return a new object with the same properties as the original task object, but with the subTasks property updated with the new subTasks array
                  return { ...task, subTasks };
                }
                return task;
              });

              // Return a new object with the same properties as the original column object, but with the tasks property updated with the new tasks array
              return { ...column, tasks };
            }
            return column;
          });

          // Return a new object with the same properties as the original board object, but with the columns property updated with the new columns array
          newActive = {...board , columns}
          return { ...board, columns };
        }
        return board;
      });

      // Set the editedBoards array to local storage
      window.localStorage.setItem('boards', JSON.stringify(editedBoards));

      // Update the activeBoard state with the editedBoards array
      setUpLocalStorage(newActive);
      
    }
  };

  const deleteTask = (boardId : string , columnId : string , taskId:string) => {
    const localBoard = window.localStorage.getItem('boards');
    if (localBoard){
      const localBoardPres: Board[] = JSON.parse(localBoard);

      let newActive : Board = activeBoard;

      const editedBoards = localBoardPres.map(board => {
        if (board.id === boardId) {
          const columns = board.columns.map(column => {
            if (column.id === columnId) {
              const tasks = column.tasks?.filter(task => {
                return task.id !== taskId;
              });
              return { ...column, tasks };
            }
            return column;
          });
          newActive = {...board , columns}
          return { ...board, columns };
        }
        return board;
      });

      window.localStorage.setItem('boards', JSON.stringify(editedBoards));

      setUpLocalStorage(newActive);
    }
  }


  const editTask = (boardId : string , columnId : string, prevColumnId : string , task : Task) => {

    const localBoard = window.localStorage.getItem('boards');
    if (localBoard){
      const localBoardPres: Board[] = JSON.parse(localBoard);

      let newActive : Board = activeBoard;

      const editedBoards = localBoardPres.map(board => {
        if (board.id === boardId) {
          const columns = board.columns.map(column => {
            if (column.id === columnId) {

              let exict : boolean = false ;
              if(column?.tasks?.length){
                const tasks = column.tasks?.map(mappedTask => {
                  if(mappedTask.id === task.id){
                    exict = true;
                    return task ;
                  }
                  return mappedTask;
                });
                
                if(!exict){
                  tasks.push(task);
                }

                return { ...column, tasks };
              }else{
                const tasks = [task];
                return  { ...column, tasks };
              }
              
            }
            return column;
          });
          
          newActive = {...board , columns}
          return { ...board, columns };
        }
        return board;
      });

      window.localStorage.setItem('boards', JSON.stringify(editedBoards));

      if(prevColumnId !== columnId){
        deleteTask(boardId,prevColumnId,task.id);
      }else{
        setUpLocalStorage(newActive);
      }
    }
  }

  // If User Is Logged In

  const axiosPrivate = axios.create({
    baseURL : 'http://localhost:3000/',
    headers : {
        'Authorization' : `Bearer ${user?.accessToken}`
    },
    withCredentials: true
  });


  const getAllBoards = async () => {
    setBoardLoadin(true)
    try{
      const response = await axiosPrivate.get('board');
      if(response.data.boards.length){
        setBoards(response.data.boards);
        activeBoardHandler(response.data.boards[0])
      }else{
        setBoards([])
        setActiveBoard(response?.data?.boards[0]);
      }
      setBoardLoadin(false)
      console.log(response)
      return {
        status : true,
      }
    }catch(err) {
      setBoardLoadin(false)
      return {
        status : false,
        message : 'Somthing Went Wrong Please Try Again Later'
      }
    }
  }


  const addNewBoard = async (board : Board) => {
    setBoardLoadin(true)
    try{
      const response = await axiosPrivate.post('board',{
        name: board.name,
        columns : board.columns
      })
      setBoards(response.data.boards);
      setActiveBoard(response.data.boards[response.data.boards.length-1])
      setBoardLoadin(false)
      return {
        status : true,
        message : 'Board Added Successfully'
      }
    }catch(err : any){
      setBoardLoadin(false)
      console.log(err)
      return {
        status : false,
        message : err?.response?.data.message ? err?.response?.data.message : 'Somthing Went Wrong!'
      }
    }
  }

  const editedBoard = async (board : Board) => {
    setBoardLoadin(true)
    try{
      const response = await axiosPrivate.put('board', {
        id : board.id,
        name:board.name,
        columns : board.columns
      })
      setBoards(response.data.boards);
      setActiveBoard(board)
      setBoardLoadin(false)
      return {
        status : true,
        message : 'Board Edited Successfully'
      }
    }catch(err : any){
      setBoardLoadin(false)
      return {
        status : false,
        message : err.response.data.message ? err.response.data.message : 'Somthing Went Wrong Please Try Again Later'
      }
    }
  }

  const deleteBoard = async (boardId : string) => {
    setBoardLoadin(true)
    try{
      const response = await axiosPrivate.delete(`board/${boardId}`);
      setBoards(response.data.boards);
      setActiveBoard(response.data.boards[0]);
      setBoardLoadin(false)
      return {
        status : true,
        message: "Board Deleted Successfully"
      }
    }catch(err){
      setBoardLoadin(false)
      return {
        status : false,
        message : "Somthing Went Wrong!"
      }
    }
  }

  const addNewTask = async (boardId : string , columnId : string , task : Task) => {
    setBoardLoadin(true)
    try{
      const response = await axiosPrivate.post('task',{
        boardId : boardId,
        columnId : columnId,
        task : task
      })
      setBoards(response.data.boards)
      const boardIndex = response.data.boards.findIndex((board : Board) => board.id === boardId);
      setActiveBoard(response.data.boards[boardIndex])
      setBoardLoadin(false)
      return {
        status : true,
        message : 'Task Added Successfully'
      }
    }catch(err:any){
      setBoardLoadin(false)
      return {
        status : false,
        message : err.response.data.message ? err.response.data.message : 'Somthimg Went Wrong!'
      }
    }
  }

  const deleteTaskReq = async (boardId : string , columnId : string , taskId : string) => {
    setBoardLoadin(true)
    try{
      const response = await axiosPrivate.delete(`task/${boardId}/${columnId}/${taskId}`)
      console.log(response);
      setBoards(response.data.boards)
      const boardIndex = response.data.boards.findIndex((board : Board) => board.id === boardId);
      setActiveBoard(response.data.boards[boardIndex])
      setBoardLoadin(false)
      return {
        status:true,
        message : 'Task Deleted Successfully'
      }

    }catch(err : any){
      setBoardLoadin(false)
      return {
        status : false,
        message : err.response.data.message ? err.response.data.message : 'Somthing Went Wronge!'
      }
    }
  }

  const editeSubTasksReq = async (boardId : string , columnId : string , taskId : string , subTaskId : string) => {
    setBoardLoadin(true)
    try{
      const response = await axiosPrivate.put('task/subTask',{
        boardId,
        columnId,
        taskId,
        subTaskId
      })
      console.log(response);
      setBoards(response.data.boards)
      const boardIndex = response.data.boards.findIndex((board : Board) => board.id === boardId);
      setActiveBoard(response.data.boards[boardIndex])
      setBoardLoadin(false)
      return {
        status : true,
        message : 'SubTask Edited Succeffuly'
      }
    }catch(err : any){
      setBoardLoadin(false)
      return{
        status : false,
        message : err.response.data.message ? err.response.data.message : `Somthing Went Wrong!`
      }
    }
  }

  const editTaskReq = async (boardId : string , columnId : string ,prevColumnId : string, task : Task) => {
    setBoardLoadin(true)
    try{
      const response = await axiosPrivate.put('task',{
        boardId,
        columnId,
        prevColumnId,
        task : task
      })
      console.log(response);
      setBoards(response.data.boards)
      const boardIndex = response.data.boards.findIndex((board : Board) => board.id === boardId);
      setActiveBoard(response.data.boards[boardIndex])
      setBoardLoadin(false)
      return {
        status : true,
        message : 'Task Edited Succeffuly'
      }

    }catch(err : any) {
      setBoardLoadin(false)
      return {
        status : false,
        message : err.response.data.message ? err.response.data.message : 'Somthing Went Wrong!'
      }
    }
  }

  


  return (
    <BoardContext.Provider
      value={{
        activeBoard,
        boards,
        showAsideMain,
        boardLoading,
        setShowAsideMain,
        setUpLocalStorage,
        addToLocalStorage,
        activeBoardHandler,
        editLocalStorage,
        removeFromLocalStorage,
        addNewTaskToLocalStorage,
        editSubTaskStatus,
        deleteTask,
        editTask,
        getAllBoards,
        addNewBoard,
        editedBoard,
        deleteBoard,
        addNewTask,
        deleteTaskReq,
        editeSubTasksReq,
        editTaskReq
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContextProvider;
