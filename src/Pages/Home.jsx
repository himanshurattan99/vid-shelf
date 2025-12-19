import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import more_options_icon from '../assets/icons/more-options-icon.png'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import { formatDuration, shuffleArray } from '../utils'

const Home = ({ videos, removeVideo, addVideoToPlaylist }) => {
    // State to track which video's option menu is open
    const [selectedVideoId, setSelectedVideoId] = useState(null)
    // State to toggle delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const location = useLocation()

    // Filter and sort videos based on the current route
    const displayedVideos = useMemo(() => {
        if (!videos) return []

        // Convert videos object to array
        const videosArray = Object.values(videos)

        // For Home page, show random 12 videos
        if (location.pathname === '/') {
            return shuffleArray(videosArray).slice(0, 12)
        }
        // For Library page, show all videos
        else if (location.pathname === '/library') {
            return videosArray
        }

        return []
    }, [videos, location.pathname])

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {displayedVideos.map((video) => (
                    <div key={video.id} className="hover:bg-[#1e1e1e] rounded-lg cursor-pointer transition-all hover:scale-105">
                        <div className="relative">
                            {/* Link to video watch page with thumbnail card and duration overlay */}
                            <Link to={`/watch?v=${video.id}`}>
                                <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-lg bg-gray-800" alt={video.name} />
                                <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                    {formatDuration(video.duration)}
                                </span>
                            </Link>
                        </div>

                        <div className="py-1 ps-2 flex justify-between items-start gap-2">
                            <h3 className="text-sm font-medium leading-5 line-clamp-2">{video.name}</h3>

                            <div className="relative">
                                {/* Toggle dropdown menu for this video */}
                                <button onClick={() => setSelectedVideoId((selectedVideoId === video.id) ? null : video.id)}
                                    className="w-6 hover:bg-[#3c3c3c] rounded-full shrink-0 cursor-pointer"
                                >
                                    <img src={more_options_icon} alt="" />
                                </button>

                                {/* Dropdown menu: Watch Later & Remove Video options */}
                                {(selectedVideoId === video.id) && (
                                    <div className="w-max py-2 bg-[#282828] border border-white/10 rounded-md text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                        {/* Add video to Watch Later */}
                                        <div onClick={() => {
                                            addVideoToPlaylist('watch_later', video.id)
                                            setSelectedVideoId(null)
                                        }}
                                            className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                        >
                                            <img src={watch_later_icon} className="w-4" alt="" />
                                            <span>Add to Watch Later</span>
                                        </div>

                                        {/* Remove video (opens confirmation modal) */}
                                        <div onClick={() => setShowDeleteModal(true)}
                                            className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                        >
                                            <img src={remove_icon} className="w-4" alt="" />
                                            <span>Remove Video</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete video modal */}
            {(showDeleteModal) && (
                <div className="bg-black/50 flex justify-center items-start absolute inset-0 z-10">
                    <div className="mt-16 p-5 bg-[#212121] border border-white/10 rounded-lg">
                        <h3 className="mb-5 text-lg font-medium">Delete this video?</h3>

                        <div className="flex justify-center gap-5">
                            {/* Cancel deletion */}
                            <button onClick={() => setShowDeleteModal(false)}
                                className="py-1 px-3 hover:bg-[#3c3c3c] rounded-full cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>

                            {/* Confirm delete and close modal */}
                            <button onClick={() => {
                                removeVideo(selectedVideoId)
                                setSelectedVideoId(null)
                                setShowDeleteModal(false)
                            }}
                                className="py-1 px-3 bg-red-600 hover:bg-red-700 rounded-full cursor-pointer transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home