import { useContext, useEffect, useState } from 'react'
import Aside from './components/Aside'
import Header from './components/Header'
import Main from './components/Main';
import { Board, BoardContext } from './context/boardContext';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';
import Loading from './components/Loading';

function App() {
  const {boards ,setUpLocalStorage,getAllBoards , boardLoading} = useContext(BoardContext);
  const {refreshToken , isLoggedIn , loadingAuth} = useContext(AuthContext);

  useEffect(() => {
    if(isLoggedIn){
      getAllBoards()
    }else{
      setUpLocalStorage();
    }
  },[isLoggedIn])

  useEffect(() => {
    refreshToken() ;
  },[])


  return (
    <>
      <Header/>
      <Aside/>
      <Main/>
      <Toaster
        toastOptions={{
            className: '',
            style: {
            padding: '16px',
            color: 'white',
            backgroundColor:'#20212c',
            border : '0.5px solid white'
            },
        }}
      />
      {(loadingAuth || boardLoading) && (
        <div className="app-loading">
          <Loading/>
        </div>
      )}
    </>
  )
}

export default App
