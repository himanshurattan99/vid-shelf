import { Link } from 'react-router-dom'
import home_icon from '../assets/icons/home-icon.png'
import library_icon from '../assets/icons/library-icon.png'
import playlists_icon from '../assets/icons/playlists-icon.png'
import tags_icon from '../assets/icons/tags-icon.png'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import settings_icon from '../assets/icons/settings-icon.png'

const Sidebar = ({ isExpanded = true, mode = 'contract' }) => {
    // Show labels when sidebar is expanded
    const isLabelVisible = isExpanded
    // Check if sidebar is in 'slide' mode (overlay) or 'contract' mode (static)
    const isSlidingMode = (mode === 'slide')

    return (
        <>
            {/* Sidebar container: Absolute overlay in 'slide' mode, static width in 'contract' mode */}
            <div className={`h-[92.5vh] ${(isLabelVisible) ? 'md:w-[27%] lg:w-[16%]' : ''} px-3 md:px-5 bg-[#181818] text-slate-100 shrink-0 overflow-y-auto transition-transform duration-250 ${(isSlidingMode && !isExpanded) ? '-translate-x-full' : ''} ${(isSlidingMode) ? 'absolute z-10' : ''}`}>
                {/* Home, Playlists and Library section */}
                <div className="py-3 border-b border-b-[#3d3d3d]">
                    <Link to={`/`}>
                        <button className={`w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer`}>
                            <img src={home_icon} className="w-6" alt="" />
                            {(isLabelVisible) && <span className="truncate">Home</span>}
                        </button>
                    </Link>

                    <Link to={`/library`}>
                        <button className={`w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer`}>
                            <img src={library_icon} className="w-6" alt="" />
                            {(isLabelVisible) && <span className="truncate">Library</span>}
                        </button>
                    </Link>
                </div>

                {/* Playlists, Tags and Watch Later section */}
                <div className="py-3 border-b border-b-[#3d3d3d]">
                    <button className={`w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer`}>
                        <img src={playlists_icon} className="w-6" alt="" />
                        {(isLabelVisible) && <span className="truncate">Playlists</span>}
                    </button>

                    <button className={`w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer`}>
                        <img src={tags_icon} className="w-6" alt="" />
                        {(isLabelVisible) && <span className="truncate">Tags</span>}
                    </button>

                    <button className={`w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer`}>
                        <img src={watch_later_icon} className="w-6" alt="" />
                        {(isLabelVisible) && <span className="truncate">Watch Later</span>}
                    </button>
                </div>

                {/* Settings section */}
                <div className="py-3">
                    <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
                        <img src={settings_icon} className="w-6" alt="" />
                        {(isLabelVisible) && <span className="truncate">Settings</span>}
                    </button>
                </div>
            </div >
        </>
    )
}

export default Sidebar