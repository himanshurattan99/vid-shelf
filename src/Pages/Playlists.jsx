import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import create_icon from '../assets/icons/create-icon.png'
import more_options_icon from '../assets/icons/more-options-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import Modal from '../Components/Modal'

const Playlists = ({ videos, playlists, createPlaylist, removePlaylist }) => {
    // Convert playlists object to array
    const playlistsArray = Object.values(playlists)

    // State to track which playlist's option menu is open
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)
    // State to toggle create playlist modal
    const [showCreateModal, setShowCreateModal] = useState(false)
    // State to toggle delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const navigate = useNavigate()

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <div className="mb-3 flex justify-between items-center">
                <h2 className="text-xl font-bold">Playlists</h2>

                <button onClick={() => setShowCreateModal(true)}
                    className="py-2 px-3 bg-[#2e2e2e] hover:bg-[#3e3e3e] rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                >
                    <img src={create_icon} className="w-5" alt="Create Playlist" />
                    <div className="text-sm font-medium">Create Playlist</div>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {playlistsArray.map((playlist) => {
                    // Get the first video to use as the playlist thumbnail
                    const firstVideoId = playlist.videoIds[0]
                    const firstVideo = videos[firstVideoId]

                    return (
                        <div key={playlist.id} className="p-2 hover:bg-[#212121] rounded-lg cursor-pointer transition-colors">
                            <div className="aspect-video relative">
                                {/* Navigate to playlist page */}
                                <div onClick={() => navigate(`/playlist?p=${playlist.id}`)}>
                                    {(firstVideo && firstVideo.thumbnail) ? (
                                        <img src={firstVideo.thumbnail} className="w-full object-cover rounded-lg" alt={firstVideo.name} />
                                    ) : (
                                        // Show placeholder if playlist is empty or first video has no thumbnail
                                        <div className="h-full bg-[#282828] rounded-lg text-sm flex justify-center items-center">No preview</div>
                                    )}
                                    <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                        {playlist.videoIds.length} videos
                                    </span>
                                </div>
                            </div>

                            <div className="py-1 ps-2 flex justify-between items-start gap-2">
                                <h3 className="text-sm font-medium leading-5 line-clamp-2">{playlist.name}</h3>

                                <div className="relative">
                                    {/* Toggle dropdown menu for this playlist */}
                                    <button onClick={() => setSelectedPlaylistId((selectedPlaylistId === playlist.id) ? null : playlist.id)}
                                        className="w-6 hover:bg-[#3c3c3c] rounded-full shrink-0 cursor-pointer"
                                    >
                                        <img src={more_options_icon} alt="" />
                                    </button>

                                    {/* Dropdown menu: Remove Playlist option */}
                                    {(selectedPlaylistId === playlist.id) && (
                                        <div className="w-max py-2 bg-[#282828] rounded-md border border-white/10 text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                            {/* Remove playlist (opens confirmation modal) */}
                                            <div onClick={() => setShowDeleteModal(true)}
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
                <Modal type="create-playlist"
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
                    type="delete-playlist"
                    title="Delete this playlist?"
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => {
                        removePlaylist(selectedPlaylistId)
                        setSelectedPlaylistId(null)
                        setShowDeleteModal(false)
                    }}
                />
            )}
        </div>
    )
}

export default Playlists