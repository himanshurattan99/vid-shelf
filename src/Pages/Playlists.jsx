import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import create_icon from '../assets/icons/create-icon.png'
import more_options_icon from '../assets/icons/more-options-icon.png'
import selection_box_icon from '../assets/icons/selection-box-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import Modal from '../Components/Modal'

const Playlists = ({ videos, playlists, createPlaylist, removePlaylists }) => {
    // Convert playlists object to array
    const playlistsArray = Object.values(playlists)

    // State to track which playlist's option menu is open
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)
    // State to toggle create playlist modal
    const [showCreateModal, setShowCreateModal] = useState(false)
    // State to toggle delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    // State variables for batch removal (multi-select)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedPlaylistIds, setSelectedPlaylistIds] = useState([])
    const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false)

    const navigate = useNavigate()

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <div className="mb-3 flex justify-between items-center">
                <h2 className="text-xl font-bold">Playlists</h2>

                <div className="flex gap-2">
                    {/* Header Action Buttons */}
                    {(isSelectionMode) ? (
                        <>
                            {/* Cancel Selection */}
                            <button
                                onClick={() => {
                                    setIsSelectionMode(false)
                                    setSelectedPlaylistIds([])
                                }}
                                className="py-1.5 px-4 bg-[#282828] hover:bg-[#3d3d3d] rounded-full text-sm font-medium transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>

                            {/* Batch Remove Button */}
                            <button
                                onClick={() => {
                                    if (selectedPlaylistIds.length > 0) {
                                        setShowDeleteMultipleModal(true)
                                    }
                                }}
                                disabled={selectedPlaylistIds.length === 0}
                                className={`py-1.5 px-4 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${(selectedPlaylistIds.length > 0) ? 'bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white cursor-pointer' : 'bg-[#282828] text-slate-500 cursor-not-allowed'}`}
                            >
                                <img src={remove_icon} className="w-4" alt="" />
                                <span>Remove Selected ({selectedPlaylistIds.length})</span>
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

                            {/* Create Playlist */}
                            <button onClick={() => setShowCreateModal(true)}
                                className="py-1.5 px-3 bg-[#282828] hover:bg-[#3d3d3d] rounded-full text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                <img src={create_icon} className="w-4" alt="Create Playlist" />
                                <span>Create Playlist</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {playlistsArray.map((playlist) => {
                    // Determine if the current playlist is a default one (not selectable)
                    const isDefaultPlaylist = playlist.id === 'favourites' || playlist.id === 'watch_later'
                    // Determine if the current playlist is selected for batch actions
                    const isSelected = selectedPlaylistIds.includes(playlist.id)

                    // Get the first video to use as the playlist thumbnail
                    const firstVideoId = playlist.videoIds[0]
                    const firstVideo = videos[firstVideoId]

                    return (
                        <div key={playlist.id} className={`p-2 rounded-lg transition-colors ${(isSelectionMode && isDefaultPlaylist) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#212121] cursor-pointer'} ${(isSelected) ? 'bg-[#2a2a2a] ring-2 ring-[#007fff]' : ''}`}
                            onClick={() => {
                                if (isSelectionMode) {
                                    if (isDefaultPlaylist) return // Cannot select default playlists
                                    // Toggle playlist selection
                                    if (isSelected) {
                                        setSelectedPlaylistIds(selectedPlaylistIds.filter((id) => id !== playlist.id))
                                    } else {
                                        setSelectedPlaylistIds([...selectedPlaylistIds, playlist.id])
                                    }
                                } else {
                                    // Normal click: open playlist page
                                    navigate(`/playlist?p=${playlist.id}`)
                                }
                            }}
                        >
                            {/* Playlist thumbnail card with videos count overlay */}
                            <div className="rounded-lg relative overflow-hidden">
                                {(firstVideo && firstVideo.thumbnail) ? (
                                    <img src={firstVideo.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt={firstVideo.name} />
                                ) : (
                                    // Show placeholder if playlist is empty or first video has no thumbnail
                                    <div className="w-full aspect-video bg-[#282828] rounded-lg text-sm text-white/50 flex justify-center items-center">No preview</div>
                                )}
                                <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                    {playlist.videoIds.length} videos
                                </span>
                                {/* Selection Overlay */}
                                {(isSelectionMode && !isDefaultPlaylist) && (
                                    <div className={`w-5 h-5 border-2 rounded-full ${(isSelected) ? 'bg-[#007fff] border-[#007fff]' : 'bg-black/50 border-white/50'} flex items-center justify-center absolute top-2 left-2 transition-colors`}>
                                        {(isSelected) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                )}
                            </div>

                            <div className="py-1 ps-2 flex justify-between items-start gap-2">
                                <h3 className="text-sm font-medium leading-5 line-clamp-2">{playlist.name}</h3>

                                <div className="relative">
                                    {/* Toggle dropdown menu for this playlist */}
                                    {(!isSelectionMode && !isDefaultPlaylist) && (
                                        <button onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedPlaylistId((selectedPlaylistId === playlist.id) ? null : playlist.id)
                                        }}
                                            className="w-6 hover:bg-[#3c3c3c] rounded-full shrink-0 cursor-pointer"
                                        >
                                            <img src={more_options_icon} alt="" />
                                        </button>
                                    )}

                                    {/* Dropdown menu: Remove Playlist option */}
                                    {(selectedPlaylistId === playlist.id) && (
                                        <div className="w-max py-2 bg-[#282828] rounded-md border border-white/10 text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                            {/* Remove playlist (opens confirmation modal) */}
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                setShowDeleteModal(true)
                                            }}
                                                className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                            >
                                                <img src={remove_icon} className="w-4" alt="" />
                                                <span>Remove playlist</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Create Playlist Modal */}
            {(showCreateModal) && (
                <Modal type="prompt" actionText="Create" placeholder="Playlist Name"
                    title="New Playlist"
                    onClose={() => setShowCreateModal(false)}
                    onConfirm={(newPlaylistName) => {
                        if (newPlaylistName.trim()) {
                            createPlaylist(newPlaylistName)
                            setShowCreateModal(false)
                        }
                    }}
                    playlists={playlists}
                />
            )}

            {/* Delete playlist modal */}
            {(showDeleteModal) && (
                <Modal
                    type="danger" actionText="Delete"
                    title="Delete this playlist?"
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => {
                        removePlaylists([selectedPlaylistId])
                        setSelectedPlaylistId(null)
                        setShowDeleteModal(false)
                    }}
                />
            )}

            {/* Delete multiple playlists modal */}
            {(showDeleteMultipleModal) && (
                <Modal type="danger" actionText="Delete Selected"
                    title={`Delete ${selectedPlaylistIds.length} playlist(s)?`}
                    onClose={() => setShowDeleteMultipleModal(false)}
                    onConfirm={() => {
                        removePlaylists(selectedPlaylistIds)
                        setIsSelectionMode(false)
                        setSelectedPlaylistIds([])
                        setShowDeleteMultipleModal(false)
                    }}
                />
            )}
        </div>
    )
}

export default Playlists