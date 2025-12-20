import { useState } from 'react'
import { Link } from 'react-router-dom'
import create_icon from '../assets/icons/create-icon.png'

const Playlists = ({ videos, playlists, createPlaylist }) => {
    // Convert playlists object to array
    const playlistsArray = Object.values(playlists)

    // State for create playlist input and modal visibility
    const [newPlaylistName, setNewPlaylistName] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)

    // Handle playlist creation
    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName)
            setNewPlaylistName('')
            setShowCreateModal(false)
        }
    }

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
                        <div key={playlist.id} className="p-2 hover:bg-[#1e1e1e] rounded-lg cursor-pointer transition-all hover:scale-105">
                            <div className="aspect-video relative">
                                {/* Link to playlist page */}
                                <Link to={`/playlist?p=${playlist.id}`}>
                                    {(firstVideo && firstVideo.thumbnail) ? (
                                        <img src={firstVideo.thumbnail} className="w-full object-cover rounded-lg" alt={firstVideo.name} />
                                    ) : (
                                        // Show placeholder if playlist is empty or first video has no thumbnail
                                        <div className="h-full bg-[#282828] rounded-lg text-sm flex justify-center items-center">No preview</div>
                                    )}
                                    <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                        {playlist.videoIds.length} videos
                                    </span>
                                </Link>
                            </div>

                            <div className="py-1 ps-2 flex justify-between items-start gap-2">
                                <h3 className="text-sm font-medium leading-5 line-clamp-2">{playlist.name}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Create Playlist Modal */}
            {(showCreateModal) && (
                <div className="bg-black/50 flex justify-center items-start absolute inset-0 z-10">
                    <div className="w-80 mt-16 p-5 bg-[#212121] border border-white/10 rounded-lg">
                        <h3 className="mb-3 text-lg font-medium text-center">New Playlist</h3>

                        {/* Input for playlist name */}
                        <input autoFocus type="text" placeholder="Playlist Name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreatePlaylist()
                            }}
                            className="w-full mb-3 py-2 px-3 bg-[#181818] border border-white/10 focus:border-white/30 rounded outline-none text-sm"
                        />

                        {/* Action buttons */}
                        <div className="flex justify-center gap-5">
                            {/* Cancel creation */}
                            <button onClick={() => setShowCreateModal(false)}
                                className="py-1 px-3 hover:bg-[#3c3c3c] rounded-full cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>

                            {/* Confirm creation */}
                            <button onClick={handleCreatePlaylist}
                                disabled={!newPlaylistName.trim()}
                                className="py-1 px-3 bg-[#3ea6ff] hover:bg-[#3ea6ff]/80 disabled:opacity-50 font-medium text-black rounded-full cursor-pointer disabled:cursor-not-allowed transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Playlists