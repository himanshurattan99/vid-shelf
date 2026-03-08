import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Library, History, ListVideo, Heart, Clock, Settings } from 'lucide-react'

const Sidebar = ({ isExpanded = true, mode = 'contract' }) => {
    // Show labels when sidebar is expanded or in 'slide' mode
    const isLabelVisible = isExpanded || (mode === 'slide')
    // Check if sidebar is in 'slide' mode (overlay) or 'contract' mode (static)
    const isSlidingMode = (mode === 'slide')

    const navigate = useNavigate()

    const location = useLocation()
    const currentPath = location.pathname + location.search

    return (
        <>
            {/* Sidebar container: Absolute overlay in 'slide' mode, static width in 'contract' mode */}
            <div className={`h-[92.5vh] ${(isLabelVisible) ? 'md:w-[27%] lg:w-[16%]' : ''} px-3 md:px-5 bg-[#181818] text-slate-100 shrink-0 overflow-y-auto transition-transform duration-250 ${(isSlidingMode && !isExpanded) ? '-translate-x-full' : ''} ${(isSlidingMode) ? 'absolute z-10' : ''}`}>
                {/* Home, Library and History section */}
                <div className="py-3 border-b border-b-[#3d3d3d]">
                    <button onClick={() => navigate('/')} className={`w-full p-2 ${(currentPath === '/') ? 'bg-[#2f2f2f]' : ''} hover:bg-[#2f2f2f] rounded-md flex gap-6 cursor-pointer`}>
                        <Home className="w-6" />
                        {(isLabelVisible) && <span className="truncate">Home</span>}
                    </button>

                    <button onClick={() => navigate('/library')} className={`w-full p-2 ${(currentPath === '/library') ? 'bg-[#2f2f2f]' : ''} hover:bg-[#2f2f2f] rounded-md flex gap-6 cursor-pointer`}>
                        <Library className="w-6" />
                        {(isLabelVisible) && <span className="truncate">Library</span>}
                    </button>

                    <button onClick={() => navigate('/history')} className={`w-full p-2 ${(currentPath === '/history') ? 'bg-[#2f2f2f]' : ''} hover:bg-[#2f2f2f] rounded-md flex gap-6 cursor-pointer`}>
                        <History className="w-6" />
                        {(isLabelVisible) && <span className="truncate">History</span>}
                    </button>
                </div>

                {/* Playlists, Favourites and Watch Later section */}
                <div className="py-3 border-b border-b-[#3d3d3d]">
                    <button onClick={() => navigate('/playlists')} className={`w-full p-2 ${(currentPath === '/playlists') ? 'bg-[#2f2f2f]' : ''} hover:bg-[#2f2f2f] rounded-md flex gap-6 cursor-pointer`}>
                        <ListVideo className="w-6" />
                        {(isLabelVisible) && <span className="truncate">Playlists</span>}
                    </button>

                    <button onClick={() => navigate('/playlist?p=favourites')} className={`w-full p-2 ${(currentPath === '/playlist?p=favourites') ? 'bg-[#2f2f2f]' : ''} hover:bg-[#2f2f2f] rounded-md flex gap-6 cursor-pointer`}>
                        <Heart className="w-6" />
                        {(isLabelVisible) && <span className="truncate">Favourites</span>}
                    </button>

                    <button onClick={() => navigate('/playlist?p=watch_later')} className={`w-full p-2 ${(currentPath === '/playlist?p=watch_later') ? 'bg-[#2f2f2f]' : ''} hover:bg-[#2f2f2f] rounded-md flex gap-6 cursor-pointer`}>
                        <Clock className="w-6" />
                        {(isLabelVisible) && <span className="truncate">Watch Later</span>}
                    </button>
                </div>

                {/* Settings section */}
                <div className="py-3">
                    <button onClick={() => navigate('/settings')} className={`w-full p-2 ${(currentPath === '/settings') ? 'bg-[#2f2f2f]' : ''} hover:bg-[#2f2f2f] rounded-md flex gap-6 cursor-pointer`}>
                        <Settings className="w-6" />
                        {(isLabelVisible) && <span className="truncate">Settings</span>}
                    </button>
                </div>
            </div >
        </>
    )
}

export default Sidebar