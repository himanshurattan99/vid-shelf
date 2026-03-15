import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Clock, ListVideo, Trash } from 'lucide-react'
import Error from './Error.jsx'
import VideoBrowserPage from '../Components/VideoBrowserPage.jsx'
import Modal from '../Components/Modal.jsx'
import { searchVideos, isVideoInPlaylist } from '../utils.js'

const Search = ({ videos, deleteVideos, playlists, addVideosToPlaylist, removeVideosFromPlaylist }) => {
    const navigate = useNavigate()

    // Extract search query from URL query parameters
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('q')

    // State to toggle Playlist Selector modal
    const [showPlaylistSelectorModal, setShowPlaylistSelectorModal] = useState(false)
    // State to toggle Delete from Library confirmation modal
    const [showDeleteFromLibraryModal, setShowDeleteFromLibraryModal] = useState(false)

    // Show Error page when search query parameter is missing
    if (!(searchQuery)) {
        return (
            <Error errorCode='400' errorMessage='Hey! You forgot to tell us what to search for!' />
        )
    }

    // Filter videos based on search query
    const searchResults = Object.values(searchVideos({ videos, searchQuery }))

    return (
        <VideoBrowserPage
            title={`Search Results for "${searchQuery}"`}
            displayedVideos={searchResults}
            emptyState={(
                <div className="h-[92.5vh] p-3 lg:p-6 flex-1">
                    <div className="text-sm text-slate-300">
                        No results found for "{searchQuery}"
                    </div>
                </div>
            )}
            headerClassName="mb-3 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-0"
            renderSelectionActions={({ selectedVideoIds }) => (
                <>
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
            )}
            onVideoOpen={(video) => {
                navigate(`/watch?v=${video.id}`)
            }}
            renderMenu={({ selectedVideoId, setSelectedVideoId }) => (
                <div className="w-max py-2 bg-[#282828] border border-white/10 rounded-md text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                    <div onClick={(e) => {
                        e.stopPropagation()
                        if (isVideoInPlaylist(selectedVideoId, 'watch_later', playlists)) {
                            removeVideosFromPlaylist('watch_later', [selectedVideoId])
                        } else {
                            addVideosToPlaylist('watch_later', [selectedVideoId])
                        }
                        setSelectedVideoId(null)
                    }}
                        className="py-2 px-3 hover:bg-[#3e3e3e] flex items-center gap-2 cursor-pointer"
                    >
                        <Clock className="w-4" />
                        <span>
                            {(isVideoInPlaylist(selectedVideoId, 'watch_later', playlists)) ? 'Remove from Watch Later' : 'Add to Watch Later'}
                        </span>
                    </div>

                    <div onClick={(e) => {
                        e.stopPropagation()
                        setShowPlaylistSelectorModal(true)
                    }}
                        className="py-2 px-3 hover:bg-[#3e3e3e] flex items-center gap-2 cursor-pointer"
                    >
                        <ListVideo className="w-4" />
                        <span>Select Playlist</span>
                    </div>

                    <div onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteFromLibraryModal(true)
                    }}
                        className="py-2 px-3 hover:bg-[#3e3e3e] flex items-center gap-2 cursor-pointer"
                    >
                        <Trash className="w-4" />
                        <span>Delete Video</span>
                    </div>
                </div>
            )}
            renderModals={({ selectedVideoId, setSelectedVideoId, isSelectionMode, setIsSelectionMode, selectedVideoIds, setSelectedVideoIds }) => (
                <>
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
                </>
            )}
        />
    )
}

export default Search