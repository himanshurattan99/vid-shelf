import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import more_options_icon from '../assets/icons/more-options-icon.png'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import playlists_icon from '../assets/icons/playlists-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import Modal from '../Components/Modal'
import { formatDuration } from '../utils'

const Home = ({ videos, homeVideos, deleteVideo, playlists, saveVideoToPlaylist }) => {
    const location = useLocation()

    // State to track which video's option menu is open
    const [selectedVideoId, setSelectedVideoId] = useState(null)
    // State to toggle Save to Playlist modal
    const [showSaveToPlaylistModal, setShowSaveToPlaylistModal] = useState(false)
    // State to toggle Delete from Library confirmation modal
    const [showDeleteFromLibraryModal, setShowDeleteFromLibraryModal] = useState(false)

    // Filter and sort videos based on the current route
    const displayedVideos = useMemo(() => {
        if (!videos) return []

        // Convert videos object to array
        const videosArray = Object.values(videos)

        // For Home page, show pre-shuffled 12 videos (persisted across navigation)
        if (location.pathname === '/') {
            return homeVideos || []
        }
        // For Library page, show all videos
        else if (location.pathname === '/library') {
            return videosArray
        }

        return []
    }, [videos, homeVideos, location.pathname])

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <h2 className="mb-3 text-xl font-bold">
                {(location.pathname === '/') ? 'Home' : 'Library'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {displayedVideos.map((video) => (
                    <div key={video.id} className="hover:bg-[#212121] rounded-lg cursor-pointer transition-colors">
                        <div className="relative">
                            {/* Link to video watch page with thumbnail card and duration overlay */}
                            <Link to={`/watch?v=${video.id}`}>
                                <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt={video.name} />
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

                                {/* Dropdown menu: Watch Later, Save to Playlist, Delete Video */}
                                {(selectedVideoId === video.id) && (
                                    <div className="w-max py-2 bg-[#282828] border border-white/10 rounded-md text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                        {/* Add video to Watch Later */}
                                        <div onClick={() => {
                                            saveVideoToPlaylist('watch_later', video.id)
                                            setSelectedVideoId(null)
                                        }}
                                            className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                        >
                                            <img src={watch_later_icon} className="w-4" alt="" />
                                            <span>Add to Watch Later</span>
                                        </div>

                                        {/* Save to Playlist (opens Save to Playlist modal) */}
                                        <div onClick={() => setShowSaveToPlaylistModal(true)}
                                            className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                        >
                                            <img src={playlists_icon} className="w-4" alt="" />
                                            <span>Save to Playlist</span>
                                        </div>

                                        {/* Delete video (opens Delete from Library confirmation modal) */}
                                        <div onClick={() => setShowDeleteFromLibraryModal(true)}
                                            className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                        >
                                            <img src={remove_icon} className="w-4" alt="" />
                                            <span>Delete Video</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Save video to Playlist modal */}
            {(showSaveToPlaylistModal) && (
                <Modal type="save-to-playlist"
                    title="Save to Playlist"
                    onClose={() => setShowSaveToPlaylistModal(false)}
                    onConfirm={(playlistId) => {
                        saveVideoToPlaylist(playlistId, selectedVideoId)
                        setSelectedVideoId(null)
                        setShowSaveToPlaylistModal(false)
                    }}
                    playlists={playlists}
                    videoId={selectedVideoId}
                />
            )}

            {/* Delete video from Library modal */}
            {(showDeleteFromLibraryModal) && (
                <Modal type="delete-video"
                    title="Delete from Library?"
                    onClose={() => setShowDeleteFromLibraryModal(false)}
                    onConfirm={() => {
                        deleteVideo(selectedVideoId)
                        setSelectedVideoId(null)
                        setShowDeleteFromLibraryModal(false)
                    }}
                />
            )}
        </div>
    )
}

export default Home