import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash } from 'lucide-react'
import VideoBrowserPage from '../Components/VideoBrowserPage'
import Modal from '../Components/Modal'

const History = ({ videos, history, historyEnabled, removeVideosFromHistory, clearHistory }) => {
    const navigate = useNavigate()

    // State to toggle delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    // State to toggle clear history confirmation modal
    const [showClearHistoryModal, setShowClearHistoryModal] = useState(false)

    // Retrieve video IDs from history and map them to full video objects
    const historyVideosArray = history.map((videoId) => videos[videoId] || { id: videoId })

    // Show empty state message if watch history is empty
    return (
        <VideoBrowserPage
            title="History"
            displayedVideos={historyVideosArray}
            emptyState={(
                <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] flex-1">
                    <h2 className="text-xl font-bold text-slate-100">History</h2>

                    {(!historyEnabled) && (
                        <div className="w-max mt-5 p-3 bg-red-600/10 border border-red-600/20 rounded-lg text-sm text-red-500">
                            Watch history is currently paused. New videos you watch won't show up here
                        </div>
                    )}

                    <div className="mt-5 text-sm text-slate-300">
                        Your watch history is empty
                    </div>
                </div>
            )}
            topNotice={(!historyEnabled) && (
                <div className="w-max mb-5 p-3 bg-red-600/10 border border-red-600/20 rounded-lg text-sm text-red-500">
                    Watch history is currently paused. New videos you watch won't show up here
                </div>
            )}
            renderSelectionActions={({ selectedVideoIds }) => (
                <button
                    onClick={() => {
                        if (selectedVideoIds.length > 0) {
                            setShowDeleteModal(true)
                        }
                    }}
                    disabled={selectedVideoIds.length === 0}
                    className={`py-1.5 px-4 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${(selectedVideoIds.length > 0) ? 'bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white cursor-pointer' : 'bg-[#282828] text-slate-500 cursor-not-allowed'}`}
                >
                    <Trash className="w-4" />
                    <span>Remove Selected ({selectedVideoIds.length})</span>
                </button>
            )}
            renderDefaultActions={() => (
                <button
                    onClick={() => setShowClearHistoryModal(true)}
                    className="py-1.5 px-3 bg-[#282828] hover:bg-[#3d3d3d] rounded-full text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                    <Trash className="w-4" />
                    <span>Clear History</span>
                </button>
            )}
            onVideoOpen={(video) => {
                navigate(`/watch?v=${video.id}`)
            }}
            onUnavailableClick={(video, { setSelectedVideoId }) => {
                setSelectedVideoId(video.id)
                setShowDeleteModal(true)
            }}
            renderMenu={() => (
                <div className="w-max py-2 bg-[#282828] border border-white/10 rounded-md text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                    <div onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteModal(true)
                    }}
                        className="py-2 px-3 hover:bg-[#3e3e3e] flex items-center gap-2 cursor-pointer"
                    >
                        <Trash className="w-4" />
                        <span>Remove from History</span>
                    </div>
                </div>
            )}
            renderModals={({ selectedVideoId, setSelectedVideoId, isSelectionMode, setIsSelectionMode, selectedVideoIds, setSelectedVideoIds }) => (
                <>
                    {(showDeleteModal) && (
                        <Modal type="danger"
                            actionText={(isSelectionMode) ? "Remove Selected" : "Remove"}
                            title={(isSelectionMode) ? `Remove ${selectedVideoIds.length} video(s) from History?` : "Remove from History?"}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={() => {
                                const idsToRemove = (isSelectionMode) ? selectedVideoIds : [selectedVideoId]
                                removeVideosFromHistory(idsToRemove)

                                setShowDeleteModal(false)
                                if (isSelectionMode) {
                                    setSelectedVideoIds([])
                                    setIsSelectionMode(false)
                                } else {
                                    setSelectedVideoId(null)
                                }
                            }}
                        />
                    )}

                    {(showClearHistoryModal) && (
                        <Modal type="danger" actionText="Clear"
                            title="Clear watch history?"
                            onClose={() => setShowClearHistoryModal(false)}
                            onConfirm={() => {
                                clearHistory()
                                setShowClearHistoryModal(false)
                            }}
                        />
                    )}
                </>
            )}
        />
    )
}

export default History