import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import selection_box_icon from '../assets/icons/selection-box-icon.png'
import more_options_icon from '../assets/icons/more-options-icon.png'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import playlists_icon from '../assets/icons/playlists-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import Modal from '../Components/Modal'
import { formatDuration, isVideoInPlaylist } from '../utils'

const Home = ({ videos, homeVideos, deleteVideo, deleteVideos, playlists, saveVideoToPlaylist, removeVideoFromPlaylist }) => {
    const navigate = useNavigate()
    const location = useLocation()

    // State to track which video's option menu is open
    const [selectedVideoId, setSelectedVideoId] = useState(null)
    // State to toggle Playlist Selector modal
    const [showPlaylistSelectorModal, setShowPlaylistSelectorModal] = useState(false)
    // State to toggle Delete from Library confirmation modal
    const [showDeleteFromLibraryModal, setShowDeleteFromLibraryModal] = useState(false)
    // State variables for batch removal (multi-select)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedVideoIds, setSelectedVideoIds] = useState([])
    const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false)

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

    // Show empty state message if there are no videos in library
    if (displayedVideos.length === 0) {
        return (
            <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] flex-1">
                <h2 className="text-xl font-bold text-slate-100">
                    {(location.pathname === '/') ? 'Home' : 'Library'}
                </h2>
                <div className="mt-5 text-sm text-slate-300">
                    {(location.pathname === '/') ? 'No videos to show right now' : 'Your library is empty. Import some videos!'}
                </div>
            </div>
        )
    }

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <div className="mb-3 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                    {(location.pathname === '/') ? 'Home' : 'Library'}
                </h2>

                <div className="flex gap-2">
                    {/* Header Action Buttons */}
                    {(isSelectionMode) ? (
                        <>
                            {/* Cancel Selection */}
                            <button
                                onClick={() => {
                                    setIsSelectionMode(false)
                                    setSelectedVideoIds([])
                                }}
                                className="py-1.5 px-4 bg-[#282828] hover:bg-[#3d3d3d] rounded-full text-sm font-medium transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>

                            {/* Batch Delete Button */}
                            <button
                                onClick={() => {
                                    if (selectedVideoIds.length > 0) {
                                        setShowDeleteMultipleModal(true)
                                    }
                                }}
                                disabled={selectedVideoIds.length === 0}
                                className={`py-1.5 px-4 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${(selectedVideoIds.length > 0) ? 'bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white cursor-pointer' : 'bg-[#282828] text-slate-500 cursor-not-allowed'}`}
                            >
                                <img src={remove_icon} className="w-4" alt="" />
                                <span>Delete Selected ({selectedVideoIds.length})</span>
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Enter Selection Mode */}
                            <button
                                onClick={() => setIsSelectionMode(true)}
                                className="py-1.5 px-4 bg-[#282828] hover:bg-[#3d3d3d] rounded-full text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                <img src={selection_box_icon} className="w-4" alt="" />
                                <span>Select</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {displayedVideos.map((video) => {
                    // Determine if the current video is selected for batch actions
                    const isSelected = selectedVideoIds.includes(video.id)

                    return (
                        <div key={video.id} className={`hover:bg-[#212121] rounded-lg transition-colors cursor-pointer ${(isSelected) ? 'bg-[#2a2a2a] ring-2 ring-[#007fff]' : ''}`}
                            onClick={() => {
                                if (isSelectionMode) {
                                    // Toggle video selection
                                    if (isSelected) {
                                        setSelectedVideoIds(selectedVideoIds.filter((id) => id !== video.id))
                                    } else {
                                        setSelectedVideoIds([...selectedVideoIds, video.id])
                                    }
                                } else {
                                    // Normal click: open video page
                                    navigate(`/watch?v=${video.id}`)
                                }
                            }}
                        >
                            {/* Video thumbnail card with duration overlay */}
                            <div className="rounded-lg relative overflow-hidden">
                                <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt={video.name} />
                                <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                    {formatDuration(video.duration)}
                                </span>
                                {/* Progress Bar Overlay */}
                                {(video.progress > 0) && (
                                    <div className="h-1 bg-[#007fff] rounded-lg absolute bottom-0 left-0" style={{ width: `${(video.progress / video.duration) * 100}%` }}></div>
                                )}
                                {/* Selection Overlay */}
                                {(isSelectionMode) && (
                                    <div className={`w-5 h-5 border-2 rounded-full ${(isSelected) ? 'bg-[#007fff] border-[#007fff]' : 'bg-black/50 border-white/50'} flex items-center justify-center absolute top-2 left-2 transition-colors`}>
                                        {(isSelected) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                )}
                            </div>

                            <div className="py-1 ps-2 flex justify-between items-start gap-2">
                                <h3 className="text-sm font-medium leading-5 line-clamp-2">{video.name}</h3>

                                <div className="relative">
                                    {/* Toggle dropdown menu for this video */}
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedVideoId((selectedVideoId === video.id) ? null : video.id)
                                    }}
                                        className="w-6 hover:bg-[#3c3c3c] rounded-full shrink-0 cursor-pointer"
                                    >
                                        <img src={more_options_icon} alt="" />
                                    </button>

                                    {/* Dropdown menu: Watch Later, Save/Remove from Playlist, Delete Video */}
                                    {(selectedVideoId === video.id) && (
                                        <div className="w-max py-2 bg-[#282828] border border-white/10 rounded-md text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                            {/* Add/Remove video to Watch Later */}
                                            <div onClick={(e) => {
                                                e.stopPropagation()
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
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                setShowPlaylistSelectorModal(true)
                                            }}
                                                className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                            >
                                                <img src={playlists_icon} className="w-4" alt="" />
                                                <span>Select Playlist</span>
                                            </div>

                                            {/* Delete video (opens Delete from Library confirmation modal) */}
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                setShowDeleteFromLibraryModal(true)
                                            }}
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
                    )
                })}
            </div>

            {/* Save/Remove video via Playlist Selector modal */}
            {(showPlaylistSelectorModal) && (
                <Modal type="selector"
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
                <Modal type="danger" actionText="Delete"
                    title="Delete from Library?"
                    onClose={() => setShowDeleteFromLibraryModal(false)}
                    onConfirm={() => {
                        deleteVideo(selectedVideoId)
                        setSelectedVideoId(null)
                        setShowDeleteFromLibraryModal(false)
                    }}
                />
            )}

            {/* Delete multiple videos from Library modal */}
            {(showDeleteMultipleModal) && (
                <Modal type="danger" actionText="Delete Selected"
                    title={`Delete ${selectedVideoIds.length} video(s)?`}
                    onClose={() => setShowDeleteMultipleModal(false)}
                    onConfirm={() => {
                        deleteVideos(selectedVideoIds)
                        setIsSelectionMode(false)
                        setSelectedVideoIds([])
                        setShowDeleteMultipleModal(false)
                    }}
                />
            )}
        </div >
    )
}

export default Home