import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckSquare, MoreVertical, Clock, ListVideo, Trash } from 'lucide-react'
import Error from './Error.jsx'
import Modal from '../Components/Modal.jsx'
import { searchVideos, formatDuration, isVideoInPlaylist } from '../utils.js'

const Search = ({ videos, deleteVideos, playlists, addVideosToPlaylist, removeVideosFromPlaylist }) => {
    const navigate = useNavigate()

    // Extract search query from URL query parameters
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('q')

    // State to track which video's option menu is open
    const [selectedVideoId, setSelectedVideoId] = useState(null)
    // State to toggle Playlist Selector modal
    const [showPlaylistSelectorModal, setShowPlaylistSelectorModal] = useState(false)
    // State to toggle Delete from Library confirmation modal
    const [showDeleteFromLibraryModal, setShowDeleteFromLibraryModal] = useState(false)
    // State variables for batch removal (multi-select)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedVideoIds, setSelectedVideoIds] = useState([])

    // Show Error page when search query parameter is missing
    if (!(searchQuery)) {
        return (
            <Error errorCode='400' errorMessage='Hey! You forgot to tell us what to search for!' />
        )
    }

    // Filter videos based on search query
    const searchResults = Object.values(searchVideos({ videos, searchQuery }))

    // Show empty state message if there are no search results
    if (searchResults.length === 0) {
        return (
            <div className="h-[92.5vh] p-3 lg:p-6 flex-1">
                <div className="text-sm text-slate-300">
                    No results found for "{searchQuery}"
                </div>
            </div>
        )
    }

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <div className="mb-3 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                    Search Results for "{searchQuery}"
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

                            {/* Batch Add to Playlist Button */}
                            <button
                                onClick={() => {
                                    if (selectedVideoIds.length > 0) {
                                        setShowPlaylistSelectorModal(true)
                                    }
                                }}
                                disabled={selectedVideoIds.length === 0}
                                className={`py-1.5 px-4 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${(selectedVideoIds.length > 0) ? 'bg-[#007fff]/20 hover:bg-[#007fff] text-[#33a1ff] hover:text-white cursor-pointer' : 'bg-[#282828] text-slate-500 cursor-not-allowed'}`}
                            >
                                <ListVideo className="w-4" />
                                <span>Add to Playlist</span>
                            </button>

                            {/* Batch Delete Button */}
                            <button
                                onClick={() => {
                                    if (selectedVideoIds.length > 0) {
                                        setShowDeleteFromLibraryModal(true)
                                    }
                                }}
                                disabled={selectedVideoIds.length === 0}
                                className={`py-1.5 px-4 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${(selectedVideoIds.length > 0) ? 'bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white cursor-pointer' : 'bg-[#282828] text-slate-500 cursor-not-allowed'}`}
                            >
                                <Trash className="w-4" />
                                <span>Delete Selected ({selectedVideoIds.length})</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsSelectionMode(true)}
                            className="py-1.5 px-4 bg-[#282828] hover:bg-[#3d3d3d] rounded-full flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
                        >
                            <CheckSquare className="w-4" />
                            <span>Select</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {searchResults.map((video) => {
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
                                        disabled={isSelectionMode}
                                        className={`p-0.5 hover:bg-[#3c3c3c] rounded-full shrink-0 ${(isSelectionMode) ? 'opacity-0 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <MoreVertical className="size-5" />
                                    </button>

                                    {/* Dropdown menu: Watch Later, Add/Remove from Playlist, Delete Video */}
                                    {(selectedVideoId === video.id && !isSelectionMode) && (
                                        <div className="w-max py-2 bg-[#282828] border border-white/10 rounded-md text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                            {/* Add/Remove video to Watch Later */}
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                if (isVideoInPlaylist(video.id, 'watch_later', playlists)) {
                                                    removeVideosFromPlaylist('watch_later', [video.id])
                                                } else {
                                                    addVideosToPlaylist('watch_later', [video.id])
                                                }
                                                setSelectedVideoId(null)
                                            }}
                                                className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                            >
                                                <Clock className="w-4" />
                                                <span>
                                                    {(isVideoInPlaylist(video.id, 'watch_later', playlists)) ? 'Remove from Watch Later' : 'Add to Watch Later'}
                                                </span>
                                            </div>

                                            {/* Add/Remove from Playlist (opens Playlist Selector modal) */}
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                setShowPlaylistSelectorModal(true)
                                            }}
                                                className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                            >
                                                <ListVideo className="w-4" />
                                                <span>Select Playlist</span>
                                            </div>

                                            {/* Delete video (opens Delete from Library confirmation modal) */}
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                setShowDeleteFromLibraryModal(true)
                                            }}
                                                className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                            >
                                                <Trash className="w-4" />
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

            {/* Add/Remove video(s) via Playlist Selector modal */}
            {(showPlaylistSelectorModal) && (
                <Modal type="selector"
                    title="Select Playlist"
                    onClose={() => setShowPlaylistSelectorModal(false)}
                    onConfirm={(playlistId) => {
                        if (isSelectionMode) {
                            addVideosToPlaylist(playlistId, selectedVideoIds)
                        } else {
                            if (isVideoInPlaylist(selectedVideoId, playlistId, playlists)) {
                                removeVideosFromPlaylist(playlistId, [selectedVideoId])
                            } else {
                                addVideosToPlaylist(playlistId, [selectedVideoId])
                            }
                        }
                    }}
                    playlists={playlists}
                    videoId={(isSelectionMode) ? null : selectedVideoId}
                />
            )}

            {/* Delete video(s) from Library modal */}
            {(showDeleteFromLibraryModal) && (
                <Modal type="danger"
                    actionText={(isSelectionMode) ? "Delete Selected" : "Delete"}
                    title={(isSelectionMode) ? `Delete ${selectedVideoIds.length} video(s)?` : "Delete from Library?"}
                    onClose={() => setShowDeleteFromLibraryModal(false)}
                    onConfirm={() => {
                        const idsToDelete = (isSelectionMode) ? selectedVideoIds : [selectedVideoId]
                        deleteVideos(idsToDelete)

                        setShowDeleteFromLibraryModal(false)
                        if (isSelectionMode) {
                            setSelectedVideoIds([])
                            setIsSelectionMode(false)
                        } else {
                            setSelectedVideoId(null)
                        }
                    }}
                />
            )}
        </div>
    )
}

export default Search