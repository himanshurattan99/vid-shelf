import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import more_options_icon from '../assets/icons/more-options-icon.png'
import selection_box_icon from '../assets/icons/selection-box-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import Error from '../Pages/Error'
import Modal from '../Components/Modal'
import { formatDuration } from '../utils'

const Playlist = ({ videos, playlists, removeVideosFromPlaylist, clearPlaylist }) => {
    // State to track which video's option menu is open
    const [selectedVideoId, setSelectedVideoId] = useState(null)
    // State to toggle remove from playlist confirmation modal
    const [showRemoveFromPlaylistModal, setShowRemoveFromPlaylistModal] = useState(false)
    // State to toggle clear playlist confirmation modal
    const [showClearPlaylistModal, setShowClearPlaylistModal] = useState(false)
    // State variables for batch removal (multi-select)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedVideoIds, setSelectedVideoIds] = useState([])

    const navigate = useNavigate()

    // Extract playlist ID from URL query parameters
    const [searchParams] = useSearchParams()
    const playlistId = searchParams.get('p')

    // Retrieve playlist object from playlists map using playlistId
    const playlist = playlists[playlistId]
    // Retrieve video IDs from playlist and map them to full video objects
    const videoIds = playlist?.videoIds || []
    const playlistVideosArray = videoIds.map((videoId) => videos[videoId] || { id: videoId })

    // Show Error page when playlist ID parameter is missing
    if (!playlistId) {
        return (
            <Error errorCode='400' errorMessage='Hey! Tell us which playlist you want to view!' />
        )
    }
    // Show Error page when playlist doesn't exist or is not found
    if (!playlist) {
        return (
            <Error errorCode='400' errorMessage="Oops! This playlist doesn't exist or went missing!" />
        )
    }

    // Show empty state message if there are no videos in playlist
    if (playlistVideosArray.length === 0) {
        return (
            <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] flex-1">
                <h2 className="text-xl font-bold text-slate-100">
                    {playlist.name}
                </h2>
                <div className="mt-5 text-sm text-slate-300">
                    There are no videos in this playlist yet
                </div>
            </div>
        )
    }

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <div className="mb-3 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                    {playlist.name}
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

                            {/* Batch Remove Button */}
                            <button
                                onClick={() => {
                                    if (selectedVideoIds.length > 0) {
                                        setShowRemoveFromPlaylistModal(true)
                                    }
                                }}
                                disabled={selectedVideoIds.length === 0}
                                className={`py-1.5 px-4 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${(selectedVideoIds.length > 0) ? 'bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white cursor-pointer' : 'bg-[#282828] text-slate-500 cursor-not-allowed'}`}
                            >
                                <img src={remove_icon} className="w-4" alt="" />
                                <span>Remove Selected ({selectedVideoIds.length})</span>
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

                            {/* Clear Entire Playlist */}
                            <button
                                onClick={() => setShowClearPlaylistModal(true)}
                                className="py-1.5 px-3 bg-[#282828] hover:bg-[#3d3d3d] rounded-full text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                <img src={remove_icon} className="w-4" alt="" />
                                <span>Clear Playlist</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {playlistVideosArray.map((video) => {
                    // Check if video exists by verifying 'url' property (it might have been deleted from library)
                    if (!video.url) {
                        return (
                            <div key={video.id}
                                onClick={() => {
                                    setSelectedVideoId(video.id)
                                    setShowRemoveFromPlaylistModal(true)
                                }}
                                className="aspect-video bg-[#282828] hover:bg-[#333] rounded-lg text-sm text-white/20 hover:text-slate-100 flex justify-center items-center cursor-pointer transition-colors"
                            >
                                Video Unavailable
                            </div>
                        )
                    }

                    // Determine if the current video is selected for batch actions
                    const isSelected = selectedVideoIds.includes(video.id)

                    return (
                        <div key={video.id} className={`rounded-lg hover:bg-[#212121] transition-colors cursor-pointer ${(isSelected) ? 'bg-[#2a2a2a] ring-2 ring-[#007fff]' : ''}`}
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
                                    navigate(`/watch?v=${video.id}&p=${playlistId}`)
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
                                        disabled={isSelectionMode}
                                        className={`w-6 hover:bg-[#3c3c3c] rounded-full shrink-0 ${(isSelectionMode) ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <img src={more_options_icon} alt="" />
                                    </button>

                                    {/* Dropdown menu: Remove Video option */}
                                    {(selectedVideoId === video.id && !isSelectionMode) && (
                                        <div className="w-max py-2 bg-[#282828] rounded-md border border-white/10 text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                            {/* Remove video from playlist (opens confirmation modal) */}
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                setShowRemoveFromPlaylistModal(true)
                                            }}
                                                className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                            >
                                                <img src={remove_icon} className="w-4" alt="" />
                                                <span>Remove from {playlist.name}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Remove video(s) from playlist modal */}
            {(showRemoveFromPlaylistModal) && (
                <Modal type="danger"
                    actionText={(isSelectionMode) ? "Remove Selected" : "Remove"}
                    title={(isSelectionMode) ? `Remove ${selectedVideoIds.length} video(s)?` : "Remove from playlist?"}
                    onClose={() => setShowRemoveFromPlaylistModal(false)}
                    onConfirm={() => {
                        const idsToRemove = (isSelectionMode) ? selectedVideoIds : [selectedVideoId]
                        removeVideosFromPlaylist(playlistId, idsToRemove)

                        setShowRemoveFromPlaylistModal(false)
                        if (isSelectionMode) {
                            setSelectedVideoIds([])
                            setIsSelectionMode(false)
                        } else {
                            setSelectedVideoId(null)
                        }
                    }}
                />
            )}

            {/* Clear playlist modal */}
            {(showClearPlaylistModal) && (
                <Modal type="danger" actionText="Clear"
                    title={`Clear ${playlist.name}?`}
                    onClose={() => setShowClearPlaylistModal(false)}
                    onConfirm={() => {
                        clearPlaylist(playlistId)
                        setShowClearPlaylistModal(false)
                    }}
                />
            )}
        </div>
    )
}

export default Playlist