import { Link } from 'react-router-dom'
import home_icon from '../assets/icons/home-icon.png'
import playlists_icon from '../assets/icons/playlists-icon.png'
import library_icon from '../assets/icons/library-icon.png'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import settings_icon from '../assets/icons/settings-icon.png'

const Sidebar = ({ isExpanded = true, deviceType = 'desktop' }) => {
    // Show labels when sidebar is expanded
    const isLabelVisible = isExpanded
    // Check if current device is mobile
    const isMobileDevice = (deviceType === 'mobile')

    return (
        <>
            <div className={`h-[92.5vh] ${(isLabelVisible) ? 'md:w-[27%] lg:w-[16%]' : ''} ${(isMobileDevice) ? 'px-3' : 'px-5'} bg-[#181818] text-slate-100 shrink-0 overflow-y-auto transition-transform duration-250`}>
                {/* Home, Playlists and Library section */}
                <div className="py-3 border-b border-b-[#3d3d3d]">
                    <Link to={`/`}>
                        <button className={`w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer`}>
                            <img src={home_icon} className="w-6" alt="" />
                            {(isLabelVisible) && <span className="truncate">Home</span>}
                        </button>
                    </Link>

                    <button className={`w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer`}>
                        <img src={playlists_icon} className="w-6" alt="" />
                        {(isLabelVisible) && <span className="truncate">Playlists</span>}
                    </button>

                    <button className={`w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer`}>
                        <img src={library_icon} className="w-6" alt="" />
                        {(isLabelVisible) && <span className="truncate">Library</span>}
                    </button>
                </div>

                {/* Favourite Playlists section */}
                <div className="py-3 border-b border-b-[#3d3d3d]">
                    {(isLabelVisible) && <h2 className={`p-2 text-lg font-medium`}>Favourites</h2>}

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