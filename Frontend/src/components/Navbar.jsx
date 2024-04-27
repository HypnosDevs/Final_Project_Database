import React, { useState, useEffect } from 'react'
import { FaXmark, FaBarsStaggered } from "react-icons/fa6";



const Navbar = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [isToggleMenu, setIsToggleMenu] = useState(false);

    const toggleMenu = () => {
        setIsToggleMenu(!isToggleMenu);
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            }
            else {
                setIsSticky(false);
            }
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [])


    const navitems = [
        { "link": "Home" },
        { "link": "About" },
        { "link": "Projects" },
        { "link": "Certificates" },
        { "link": "Contacts" }
    ]
    return (
        <>
            <header >
                <nav className={`fixed top-0 left-0 right-0 flex justify-between items-center px-4  py-2 ${isSticky ? "bg-black text-white" : "bg-slate-400"}`}>
                    {
                        <div className="navitems max-[640px]:hidden">
                            {navitems.map(({ link }) => {
                                return <a key={link} className="px-4" href={`#${link}`}>{link}</a>
                            })}
                        </div>
                    }
                    <div className="headername">
                        Supajit
                    </div>
                    {/*  btn for the mobile devices*/}
                    < div className='min-[640px]:hidden' >
                        <button onClick={toggleMenu} className='text-black focus:outline-none'>{isToggleMenu ? <FaXmark className='h-5 w-5 text-black' /> : <FaBarsStaggered className='h-5 w-5 text-black' />}</button>
                    </div >
                </nav>






                {
                    isToggleMenu && (
                        <div className="menu mt-10 transition-all duration-300 border-b-1-black">{
                            navitems.map(({ link }) => {
                                return <a key={link} className="text-center py-2 block px-4 hover:bg-slate-200 border-solid box-border  border-black" href={`#${link}`}>{link}</a>;
                            })}
                        </div>
                    )
                }
            </header>

        </>
    )
}

export default Navbar