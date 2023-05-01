import React, { useContext, useEffect, useState } from 'react'
import '../style/aside/index.scss'
import AsideMainSection from './asideComponents/AsideMainSection'
import Logo from './asideComponents/Logo'
import { BoardContext } from '../context/boardContext'
function Aside() {

  const {showAsideMain , setShowAsideMain} = useContext(BoardContext);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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
    <>
    {screenWidth > 768 ? (
      <aside>
          <section>
              <Logo />
          </section>
          <AsideMainSection/>
      </aside>
    ) : showAsideMain && (
      <aside >
        <div className="state-control-div" onClick={() => setShowAsideMain(false)}>
        </div>
        <AsideMainSection/>
      </aside>
    )}

    </>
  )
}

export default Aside