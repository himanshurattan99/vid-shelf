import { useState } from 'react'
import Modal from '../Components/Modal'

const Settings = ({ historyEnabled, setHistoryEnabled, clearHistory, deleteCustomPlaylists, clearLibrary, clearAllData }) => {
    // State variables for managing confirmation modals visibility
    const [showClearHistoryModal, setShowClearHistoryModal] = useState(false)
    const [showDeleteCustomPlaylistsModal, setShowDeleteCustomPlaylistsModal] = useState(false)
    const [showClearLibraryModal, setShowClearLibraryModal] = useState(false)
    const [showClearDataModal, setShowClearDataModal] = useState(false)

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <h2 className="mb-6 text-xl font-bold">Settings</h2>

            <div className="max-w-3xl flex flex-col gap-6">
                {/* Watch History Setting */}
                <div className="p-4 bg-[#212121] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-100">Enable Watch History</h3>
                        <div className="mt-1 text-sm text-slate-400">
                            Keep track of the videos you watch. When turned off, your history won't be updated, but your past history will remain unless you clear it.
                        </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                        onClick={() => setHistoryEnabled(!historyEnabled)}
                        className={`w-10 h-5 ${(historyEnabled) ? 'bg-[#007fff]' : 'bg-[#3e3e3e]'} rounded-full shrink-0 relative transition-colors duration-300 cursor-pointer`}
                    >
                        <div className={`size-4 bg-white rounded-full absolute top-0.5 ${(historyEnabled) ? 'translate-x-5' : 'translate-x-1'} transition-transform duration-300`}></div>
                    </button>
                </div>

                {/* Data Management Options */}
                <div className="p-4 bg-[#212121] rounded-xl flex flex-col gap-4">
                    <h3 className="mb-2 pb-2 font-semibold text-slate-100 border-b border-white/10">Data Management</h3>

                    {/* Clear Watch History */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-200">Clear Watch History</h4>
                            <div className="mt-1 text-xs text-slate-400">
                                Remove all videos from your watch history. Your playlists and imported videos will not be affected.
                            </div>
                        </div>

                        <button
                            onClick={() => setShowClearHistoryModal(true)}
                            className="py-1.5 px-4 bg-[#3d3d3d] hover:bg-[#4d4d4d] rounded-full text-sm font-medium shrink-0 transition-colors cursor-pointer"
                        >
                            Clear History
                        </button>
                    </div>

                    <div className="h-px my-1 bg-white/5"></div>

                    {/* Delete Custom Playlists */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-200">Delete Custom Playlists</h4>
                            <div className="mt-1 text-xs text-slate-400">
                                Delete all playlists you have created. 'Favourites' and 'Watch Later' will not be deleted, but their contents will be emptied.
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDeleteCustomPlaylistsModal(true)}
                            className="py-1.5 px-4 bg-[#3d3d3d] hover:bg-[#4d4d4d] rounded-full text-sm font-medium shrink-0 transition-colors cursor-pointer"
                        >
                            Delete Playlists
                        </button>
                    </div>

                    <div className="h-px my-1 bg-white/5"></div>

                    {/* Clear Library */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-500">Clear Library</h4>
                            <div className="mt-1 text-xs text-slate-400">
                                Remove all your imported videos from everywhere, including watch history. Your custom playlists will be kept but emptied.
                            </div>
                        </div>

                        <button
                            onClick={() => setShowClearLibraryModal(true)}
                            className="py-1.5 px-4 bg-red-600/20 hover:bg-red-600 rounded-full text-sm font-medium text-red-500 hover:text-white shrink-0 transition-colors cursor-pointer"
                        >
                            Clear Library
                        </button>
                    </div>

                    <div className="h-px my-1 bg-white/5"></div>

                    {/* Clear All Data */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-500">Clear All Data</h4>
                            <div className="mt-1 text-xs text-slate-400">
                                This will permanently remove all imported videos, custom playlists, and watch history. This action cannot be undone.
                            </div>
                        </div>

                        <button
                            onClick={() => setShowClearDataModal(true)}
                            className="py-1.5 px-4 bg-red-600/20 hover:bg-red-600 rounded-full text-sm font-medium text-red-500 hover:text-white shrink-0 transition-colors cursor-pointer"
                        >
                            Clear Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Clear History Confirmation Modal */}
            {(showClearHistoryModal) && (
                <Modal type="confirm" actionText="Clear"
                    title="Clear watch history?"
                    onClose={() => setShowClearHistoryModal(false)}
                    onConfirm={() => {
                        clearHistory()
                        setShowClearHistoryModal(false)
                    }}
                />
            )}

            {/* Delete Custom Playlists Confirmation Modal */}
            {showDeleteCustomPlaylistsModal && (
                <Modal type="danger" actionText="Delete Playlists"
                    title="Delete all custom playlists?"
                    onClose={() => setShowDeleteCustomPlaylistsModal(false)}
                    onConfirm={() => {
                        deleteCustomPlaylists()
                        setShowDeleteCustomPlaylistsModal(false)
                    }}
                />
            )}

            {/* Clear Library Confirmation Modal */}
            {(showClearLibraryModal) && (
                <Modal type="danger" actionText="Clear"
                    title="Clear videos from library?"
                    onClose={() => setShowClearLibraryModal(false)}
                    onConfirm={() => {
                        clearLibrary()
                        setShowClearLibraryModal(false)
                    }}
                />
            )}

            {/* Clear All Data Confirmation Modal */}
            {(showClearDataModal) && (
                <Modal type="danger" actionText="Delete All"
                    title="Delete all the app data?"
                    onClose={() => setShowClearDataModal(false)}
                    onConfirm={() => {
                        clearAllData()
                        setShowClearDataModal(false)
                    }}
                />
            )}
        </div>
    )
}

export default Settings