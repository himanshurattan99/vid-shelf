import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import selection_box_icon from '../assets/icons/selection-box-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import more_options_icon from '../assets/icons/more-options-icon.png'
import Modal from '../Components/Modal'
import { formatDuration } from '../utils'

const History = ({ videos, history, historyEnabled, removeVideosFromHistory, clearHistory }) => {
    // State to track which video's option menu is open
    const [selectedVideoId, setSelectedVideoId] = useState(null)
    // State to toggle delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    // State to toggle clear history confirmation modal
    const [showClearHistoryModal, setShowClearHistoryModal] = useState(false)
    // State variables for batch removal (multi-select)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedVideoIds, setSelectedVideoIds] = useState([])

    const navigate = useNavigate()

    // Retrieve video IDs from history and map them to full video objects
    const historyVideosArray = history.map((videoId) => videos[videoId] || { id: videoId })

    // Show empty state message if watch history is empty
    if (historyVideosArray.length === 0) {
        return (
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
        )
    }

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <div className="mb-3 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                    History
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
                                        setShowDeleteModal(true)
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

                            {/* Clear Entire History */}
                            <button
                                onClick={() => setShowClearHistoryModal(true)}
                                className="py-1.5 px-3 bg-[#282828] hover:bg-[#3d3d3d] rounded-full text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                <img src={remove_icon} alt="" className="w-4" />
                                <span>Clear History</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {(!historyEnabled) && (
                <div className="w-max mb-5 p-3 bg-red-600/10 border border-red-600/20 rounded-lg text-sm text-red-500">
                    Watch history is currently paused. New videos you watch won't show up here
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {historyVideosArray.map((video) => {
                    // Check if video exists by verifying 'url' property (it might have been deleted from library)
                    if (!video.url) {
                        return (
                            <div key={video.id}
                                onClick={() => {
                                    setSelectedVideoId(video.id)
                                    setShowDeleteModal(true)
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
                                        className="w-6 hover:bg-[#3c3c3c] rounded-full shrink-0 cursor-pointer"
                                    >
                                        <img src={more_options_icon} alt="" />
                                    </button>

                                    {/* Dropdown menu: Remove Video option */}
                                    {(selectedVideoId === video.id) && (
                                        <div className="w-max py-2 bg-[#282828] rounded-md border border-white/10 text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                            {/* Remove video from history (opens confirmation modal) */}
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                setShowDeleteModal(true)
                                            }}
                                                className="px-3 py-2 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-2"
                                            >
                                                <img src={remove_icon} className="w-4" alt="" />
                                                <span>Remove from History</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Remove video(s) from history modal */}
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

            {/* Clear history modal */}
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
        </div>
    )
}

export default History