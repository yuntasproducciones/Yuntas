import { useState } from "react"

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

const NavLinks = ({ item }) => {
    const nuevoTexto = capitalizar(item.texto)
    return <li className="text-lg font-normal flex hover:bg-black/80 transition-all duration-300"><a className="w-full py-1 px-3" href={item.link}>{nuevoTexto}</a></li>
}

const BurgerMenu = ({ links }) => {
    const [isOpen, setIsOpen] = useState(false)

    function handleClick() {
        setIsOpen((prev) => !prev)
    }

    return (
        <>
            <button className="w-10 h-10 lg:hidden" onClick={handleClick}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4 18L20 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"></path>
                    <path
                        d="M4 12L20 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"></path>
                    <path
                        d="M4 6L20 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"></path>
                </svg>
            </button>
            <aside className={`fixed left-0 transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} pb-9 border-b-2 border-r-2 border-white bg-linear-to-b to-blue-950 to-55% backdrop-blur-xs absolute w-72 h-96 top-28 rounded-br-4xl`}>
                <div className="px-3 h-1/8 flex flex-col justify-around text-center">
                    <span className="text-xl">Indice</span>
                    <hr className="w-full" />
                </div>
                <ul className="flex flex-col justify-evenly h-6/8">
                    {links.map((item, index) => {
                        return <NavLinks key={index} item={item} />
                    })}
                </ul>
                <div className="h-1/8 px-3">
                    <hr className="h-full" />
                </div>
            </aside >
        </>
    )
}

export default BurgerMenu