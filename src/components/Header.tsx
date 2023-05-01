import React, { useEffect, useState } from 'react'
import Logo from './asideComponents/Logo'
import '../style/header/index.scss'
import Nav from './HeaderComponents/Nav'

function Header() {
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
    <header>
        {screenWidth <= 768 && (
          <Logo/>
        )}
        <Nav/>
    </header>
  )
}

export default Header