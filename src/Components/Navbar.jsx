import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import menu_icon from '../assets/icons/menu-icon.png'
import vidshelf_logo from '../assets/logos/vidshelf-logo.png'
import search_icon from '../assets/icons/search-icon.png'
import microphone_icon from '../assets/icons/microphone-icon.png'
import cross_icon from '../assets/icons/cross-icon.png'
import import_icon from '../assets/icons/import-icon.png'
import profile_icon from '../assets/icons/profile-icon.png'

const Navbar = ({ onMenuClick, onImport }) => {
    // State to track search bar expansion on mobile screens
    const [searchBarExpanded, setSearchBarExpanded] = useState(false)

    // Ref for the hidden file input element
    const fileInputRef = useRef(null)

    // Toggles the search bar visibility state for mobile screens
    const toggleSearchBar = () => {
        setSearchBarExpanded(!(searchBarExpanded))
    }

    return (
        // Main Navbar container
        <nav className="h-[7.5vh] px-3 sm:px-5 bg-[#181818] flex justify-between sticky top-0">
            {/* Left section: Menu button and logo */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
                {/* Menu button to open/close sidebar */}
                <button onClick={onMenuClick} className="p-2 hover:bg-[#3c3c3c] rounded-full cursor-pointer">
                    <img src={menu_icon} className="w-6" alt="Menu" />
                </button>
                {/* Logo linking to the home page */}
                <Link to='/'>
                    <img src={vidshelf_logo} className="w-24 cursor-pointer" alt="VidShelf Logo" />
                </Link>
            </div>

            {/* Middle section: Search bar (hidden on mobile screens, visible on larger screens) */}
            <div className="hidden sm:w-1/2 lg:w-2/5 sm:flex sm:items-center sm:gap-3 lg:gap-5">
                {/* Search input field */}
                <div className="w-full py-2 px-4 border border-[#3d3d3d] focus-within:border-[#007fff] rounded-3xl flex items-center gap-2">
                    <input placeholder="Search" type="text" className="w-full outline-none text-slate-100" />
                    <img src={search_icon} className="size-5" alt="Search" />
                </div>
                {/* Microphone icon for voice search */}
                <img src={microphone_icon} className="size-5" alt="Microphone" />
            </div>

            {/* Right section: Search button (on mobile screens), Import button, Profile icon */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
                {/* Mobile search bar - shows expanded view or toggle button based on state */}
                {(searchBarExpanded) ?
                    (
                        // Expanded mobile search bar
                        <div className="px-2 bg-[#181818] sm:hidden flex items-center gap-2 absolute inset-0">
                            {/* Close button for expanded search */}
                            <button onClick={toggleSearchBar} className="p-1 hover:bg-[#3c3c3c] rounded-full cursor-pointer">
                                <img src={cross_icon} className="size-7" alt="Close" />
                            </button>

                            {/* Expanded search input field */}
                            <div className="py-2 px-4 border border-[#3d3d3d] focus-within:border-[#007fff] rounded-3xl flex-1 flex items-center gap-2">
                                <input autoFocus placeholder="Search" type="text" className="w-full outline-none text-slate-100" />
                                <img src={search_icon} className="size-5" alt="Search" />
                            </div>
                            {/* Microphone icon for voice search */}
                            <img src={microphone_icon} className="size-5" alt="Microphone" />
                        </div>
                    )
                    : (
                        // Mobile search toggle button
                        <div className="sm:hidden">
                            <button onClick={toggleSearchBar} className="p-2 hover:bg-[#3c3c3c] rounded-full cursor-pointer">
                                <img src={search_icon} className="size-5" alt="Search" />
                            </button>
                        </div>
                    )
                }

                {/* Hidden file input for video import */}
                <input onChange={(e) => {
                    // Convert FileList to Array to preserve files after input reset
                    const files = Array.from(e.target.files)
                    onImport(files)
                    e.target.value = ""
                }}
                    ref={fileInputRef}
                    type="file" accept="video/*" multiple
                    className="hidden"
                />
                {/* Import button to trigger file input */}
                <button onClick={() => fileInputRef.current.click()} className="py-1 px-3 bg-[#2e2e2e] hover:bg-[#3c3c3c] rounded-3xl text-slate-100 sm:flex sm:items-center sm:gap-1 cursor-pointer">
                    <img src={import_icon} className="size-6" alt="Import" />
                    <div className="hidden sm:block">Import</div>
                </button>

                {/* Profile icon */}
                <img src={profile_icon} className="size-6" alt="Profile" />
            </div>
        </nav>
    )
}

export default Navbar