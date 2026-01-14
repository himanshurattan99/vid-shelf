import { useState } from 'react'
import playlists_icon from '../assets/icons/playlists-icon.png'
import { isVideoInPlaylist } from '../utils'

const Modal = ({ type, title, onClose, onConfirm, playlists, videoId }) => {
    // State for new playlist name input
    const [newPlaylistName, setNewPlaylistName] = useState('')

    // Prevent click from propagating to backdrop (which would close modal)
    const handleContentClick = (e) => {
        e.stopPropagation()
    }

    // Render Delete Modal (for both Video and Playlist)
    if (type === 'delete-video' || type === 'delete-playlist') {
        return (
            <div onClick={onClose} className="bg-black/50 flex justify-center items-start absolute inset-0 z-10">
                <div onClick={handleContentClick} className="mt-16 p-5 bg-[#212121] border border-white/10 rounded-lg">
                    <h3 className="mb-5 text-lg font-medium">{title}</h3>

                    <div className="flex justify-center gap-5">
                        {/* Cancel deletion */}
                        <button onClick={onClose}
                            className="py-1 px-3 hover:bg-[#3c3c3c] rounded-full cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>

                        {/* Confirm delete and close modal */}
                        <button onClick={onConfirm}
                            className="py-1 px-3 bg-red-600 hover:bg-red-700 rounded-full cursor-pointer transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Render Playlist Selector Modal
    if (type === 'playlist-selector') {
        return (
            <div onClick={onClose} className="bg-black/50 flex justify-center items-start absolute inset-0 z-10">
                <div onClick={handleContentClick} className="w-64 mt-16 p-5 bg-[#212121] border border-white/10 rounded-xl">
                    <h3 className="mb-3 font-semibold text-slate-100">{title}</h3>

                    {/* List of playlists */}
                    <div className="max-h-60 mb-3 overflow-y-auto">
                        {Object.values(playlists).map((playlist) => (
                            <div key={playlist.id}
                                onClick={() => onConfirm(playlist.id)}
                                className="py-2.5 px-3 hover:bg-[#2a2a2a] rounded-lg flex justify-between items-center cursor-pointer transition-colors"
                            >
                                <div className="text-sm text-slate-200">
                                    {playlist.name}
                                </div>
                                {/* Show playlist icon if video is already in this playlist */}
                                {(isVideoInPlaylist(videoId, playlist.id, playlists)) && (
                                    <img src={playlists_icon} className="w-4" alt="" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px mb-3 bg-white/5"></div>

                    {/* Close button */}
                    <button onClick={onClose}
                        className="w-full py-2 px-3 hover:bg-[#2a2a2a] rounded-lg text-sm text-slate-300 cursor-pointer transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    }

    // Render Create Playlist Modal
    if (type === 'create-playlist') {
        return (
            <div onClick={onClose} className="bg-black/50 flex justify-center items-start absolute inset-0 z-10">
                <div onClick={handleContentClick} className="w-80 mt-16 p-5 bg-[#212121] border border-white/10 rounded-lg">
                    <h3 className="mb-3 text-lg font-medium text-center">{title}</h3>

                    {/* Input for playlist name */}
                    <input autoFocus type="text" placeholder="Playlist Name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onConfirm(newPlaylistName)
                                setNewPlaylistName('')
                            }
                        }}
                        className="w-full mb-3 py-2 px-3 bg-[#181818] border border-white/10 focus:border-white/30 rounded outline-none text-sm"
                    />

                    {/* Action buttons */}
                    <div className="flex justify-center gap-5">
                        {/* Cancel creation */}
                        <button onClick={onClose}
                            className="py-1 px-3 hover:bg-[#3c3c3c] rounded-full cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>

                        {/* Confirm creation */}
                        <button onClick={() => {
                            onConfirm(newPlaylistName)
                            setNewPlaylistName('')
                        }}
                            disabled={!newPlaylistName.trim()}
                            className="py-1 px-3 bg-[#3ea6ff] hover:bg-[#3ea6ff]/80 disabled:opacity-50 font-medium text-black rounded-full cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Render Action Confirmation Modal
    if (type === 'confirm-action') {
        return (
            <div onClick={onClose} className="bg-black/50 flex justify-center items-start absolute inset-0 z-10">
                <div onClick={handleContentClick} className="w-80 mt-6 sm:mt-16 p-5 bg-[#212121] border border-white/10 rounded-lg">
                    <h3 className="mb-3 text-lg font-medium text-center">{title}</h3>

                    {/* Action buttons */}
                    <div className="flex justify-center gap-5">
                        {/* Cancel action */}
                        <button onClick={onClose}
                            className="py-1 px-3 hover:bg-[#3c3c3c] rounded-full cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>

                        {/* Confirm action */}
                        <button onClick={onConfirm}
                            className="py-1 px-3 bg-[#3ea6ff] hover:bg-[#3ea6ff]/80 font-medium text-black rounded-full cursor-pointer transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default Modal