import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import more_options_icon from '../assets/icons/more-options-icon.png'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import playlists_icon from '../assets/icons/playlists-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import Modal from '../Components/Modal'
import { formatDuration, isVideoInPlaylist } from '../utils'

const Home = ({ videos, homeVideos, deleteVideo, playlists, saveVideoToPlaylist, removeVideoFromPlaylist }) => {
    const location = useLocation()

    // State to track which video's option menu is open
    const [selectedVideoId, setSelectedVideoId] = useState(null)
    // State to toggle Playlist Selector modal
    const [showPlaylistSelectorModal, setShowPlaylistSelectorModal] = useState(false)
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
                        <div className="rounded-lg relative overflow-hidden">
                            {/* Link to video watch page with thumbnail card and duration overlay */}
                            <Link to={`/watch?v=${video.id}`}>
                                <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt={video.name} />
                                <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                    {formatDuration(video.duration)}
                                </span>
                                {/* Progress Bar Overlay */}
                                {(video.progress > 0) && (
                                    <div className="h-1 bg-[#007fff] rounded-bl-lg rounded-tr-lg rounded-br-lg absolute bottom-0 left-0" style={{ width: `${(video.progress / video.duration) * 100}%` }}></div>
                                )}
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

                                {/* Dropdown menu: Watch Later, Save/Remove from Playlist, Delete Video */}
                                {(selectedVideoId === video.id) && (
                                    <div className="w-max py-2 bg-[#282828] border border-white/10 rounded-md text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                        {/* Add/Remove video to Watch Later */}
                                        <div onClick={() => {
                                            if (isVideoInPlaylist(video.id, 'watch_later', playlists)) {
                                                removeVideoFromPlaylist('watch_later', video.id)
                                            } else {
                                                saveVideoToPlaylist('watch_later', video.id)
                                            }
                                            setSelectedVideoId(null)
                                        }}
                                            className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                        >
                                            <img src={watch_later_icon} className="w-4" alt="" />
                                            <span>
                                                {(isVideoInPlaylist(video.id, 'watch_later', playlists)) ? 'Remove from Watch Later' : 'Add to Watch Later'}
                                            </span>
                                        </div>

                                        {/* Save/Remove from Playlist (opens Playlist Selector modal) */}
                                        <div onClick={() => setShowPlaylistSelectorModal(true)}
                                            className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                        >
                                            <img src={playlists_icon} className="w-4" alt="" />
                                            <span>Select Playlist</span>
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

            {/* Save/Remove video via Playlist Selector modal */}
            {(showPlaylistSelectorModal) && (
                <Modal type="playlist-selector"
                    title="Select Playlist"
                    onClose={() => setShowPlaylistSelectorModal(false)}
                    onConfirm={(playlistId) => {
                        if (isVideoInPlaylist(selectedVideoId, playlistId, playlists)) {
                            removeVideoFromPlaylist(playlistId, selectedVideoId)
                        } else {
                            saveVideoToPlaylist(playlistId, selectedVideoId)
                        }
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