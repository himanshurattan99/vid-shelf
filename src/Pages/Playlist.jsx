import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckSquare, Trash } from 'lucide-react'
import Error from '../Pages/Error'
import VideoGrid from '../Components/VideoGrid'
import Modal from '../Components/Modal'

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
                                <Trash className="w-4" />
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
                                <CheckSquare className="w-4" />
                                <span>Select</span>
                            </button>

                            {/* Clear Entire Playlist */}
                            <button
                                onClick={() => setShowClearPlaylistModal(true)}
                                className="py-1.5 px-3 bg-[#282828] hover:bg-[#3d3d3d] rounded-full text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                <Trash className="w-4" />
                                <span>Clear Playlist</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <VideoGrid
                displayedVideos={playlistVideosArray}
                onCardClick={(video, isSelected) => {
                    if (isSelectionMode) {
                        // Toggle video selection
                        setSelectedVideoIds((isSelected) ?
                            selectedVideoIds.filter((id) => id !== video.id)
                            : [...selectedVideoIds, video.id]
                        )
                    } else {
                        // Normal click: open video page
                        navigate(`/watch?v=${video.id}&p=${playlistId}`)
                    }
                }}
                onUnavailableClick={(video) => {
                    setSelectedVideoId(video.id)
                    setShowRemoveFromPlaylistModal(true)
                }}
                selectedVideoId={selectedVideoId}
                onToggleMenu={(videoId) => {
                    setSelectedVideoId((selectedVideoId === videoId) ? null : videoId)
                }}
                renderMenu={() => (
                    <div className="w-max py-2 bg-[#282828] border border-white/10 rounded-md text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                        <div onClick={(e) => {
                            e.stopPropagation()
                            setShowRemoveFromPlaylistModal(true)
                        }}
                            className="py-2 px-3 hover:bg-[#3e3e3e] flex items-center gap-2 cursor-pointer"
                        >
                            <Trash className="w-4" />
                            <span>Remove from {playlist.name}</span>
                        </div>
                    </div>
                )}
                isSelectionMode={isSelectionMode}
                selectedVideoIds={selectedVideoIds}
            />

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