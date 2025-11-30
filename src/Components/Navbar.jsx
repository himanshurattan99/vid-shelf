import { useState } from 'react'
import { Link } from 'react-router-dom'
import menu_icon from '../assets/icons/menu-icon.png'
import vidshelf_logo from '../assets/logos/vidshelf-logo.png'
import search_icon from '../assets/icons/search-icon.png'
import microphone_icon from '../assets/icons/microphone-icon.png'
import cross_icon from '../assets/icons/cross-icon.png'
import create_icon from '../assets/icons/create-icon.png'
import profile_icon from '../assets/icons/profile-icon.png'

const Navbar = ({ onMenuClick }) => {
    // State to track search bar expansion on mobile screens
    const [searchBarExpanded, setSearchBarExpanded] = useState(false)

    // Toggle search bar visibility on mobile screens
    const toggleSearchBar = () => {
        setSearchBarExpanded(!(searchBarExpanded))
    }

    return (
        <nav className="h-[7.5vh] px-3 sm:px-5 bg-[#181818] flex justify-between sticky top-0">
            {/* Left section: Menu button and logo */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
                <button onClick={onMenuClick} className="p-2 hover:bg-[#3c3c3c] rounded-full cursor-pointer">
                    <img src={menu_icon} className="w-6" alt="" />
                </button>
                <Link to='/'>
                    <img src={vidshelf_logo} className="w-24 cursor-pointer" alt="" />
                </Link>
            </div>

            {/* Middle section: Search bar (hidden on mobile screens) */}
            <div className="hidden sm:w-1/2 lg:w-2/5 sm:flex sm:items-center sm:gap-3 lg:gap-5">
                <div className="w-full py-2 px-4 border border-[#3d3d3d] focus-within:border-[#065fd4] rounded-3xl flex items-center gap-2">
                    <input placeholder="Search" type="text" className="w-full outline-none text-slate-100" />
                    <img src={search_icon} className="size-5" alt="" />
                </div>

                <img src={microphone_icon} className="size-5" alt="" />
            </div>

            {/* Right section: Search button (on mobile screens), Create button, Profile */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
                {/* Mobile search bar - shows expanded view or toggle button based on state */}
                {(searchBarExpanded) ?
                    (
                        <div className="px-2 bg-[#181818] sm:hidden flex items-center gap-2 absolute inset-0">
                            {/* Close button for expanded search */}
                            <button onClick={toggleSearchBar} className="p-1 hover:bg-[#3c3c3c] rounded-full cursor-pointer">
                                <img src={cross_icon} className="size-7" alt="" />
                            </button>

                            {/* Expanded search input field */}
                            <div className="py-2 px-4 border border-[#3d3d3d] focus-within:border-[#065fd4] rounded-3xl flex-1 flex items-center gap-2">
                                <input autoFocus placeholder="Search" type="text" className="w-full outline-none text-slate-100" />
                                <img src={search_icon} className="size-5" alt="" />
                            </div>

                            <img src={microphone_icon} className="size-5" alt="" />
                        </div>
                    )
                    : (
                        <div className="sm:hidden">
                            {/* Search toggle button for mobile view */}
                            <button onClick={toggleSearchBar} className="p-2 hover:bg-[#3c3c3c] rounded-full cursor-pointer">
                                <img src={search_icon} className="size-5" alt="" />
                            </button>
                        </div>
                    )
                }

                {/* Create content button - shows icon only on mobile screens, text+icon on larger screens */}
                <button className="py-1 px-3 bg-[#2e2e2e] hover:bg-[#3c3c3c] rounded-3xl text-slate-100 sm:flex sm:items-center sm:gap-1 cursor-pointer">
                    <img src={create_icon} className="size-5" alt="" />
                    <div className="hidden sm:block">Create</div>
                </button>

                <img src={profile_icon} className="size-6" alt="" />
            </div>
        </nav>
    )
}

export default Navbar