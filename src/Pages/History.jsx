import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import more_options_icon from '../assets/icons/more-options-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import Modal from '../Components/Modal'
import { formatDuration } from '../utils'

const History = ({ videos, history, historyEnabled, removeVideoFromHistory }) => {
    // State to track which video's option menu is open
    const [selectedVideoId, setSelectedVideoId] = useState(null)
    // State to toggle delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false)

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
            <h2 className="mb-3 text-xl font-bold">
                History
            </h2>

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

                    return (
                        <div key={video.id} className="hover:bg-[#212121] rounded-lg cursor-pointer transition-colors">
                            <div className="rounded-lg relative overflow-hidden">
                                {/* Video thumbnail card with duration overlay */}
                                <div onClick={() => navigate(`/watch?v=${video.id}`)}>
                                    <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt={video.name} />
                                    <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                        {formatDuration(video.duration)}
                                    </span>
                                    {/* Progress Bar Overlay */}
                                    {(video.progress > 0) && (
                                        <div className="h-1 bg-[#007fff] rounded-lg absolute bottom-0 left-0" style={{ width: `${(video.progress / video.duration) * 100}%` }}></div>
                                    )}
                                </div>
                            </div>

                            <div className="py-1 ps-2 flex justify-between items-start gap-2">
                                <h3 className="text-sm font-medium leading-5 line-clamp-2">{video.name}</h3>

                                <div className="relative">
                                    {/* Toggle dropdown menu for this video */}
                                    <button onClick={() => setSelectedVideoId((selectedVideoId === video.id) ? null : video.id)}
                                        className="w-6 hover:bg-[#3c3c3c] rounded-full shrink-0 cursor-pointer"
                                    >
                                        <img src={more_options_icon} alt="" />
                                    </button>

                                    {/* Dropdown menu: Remove Video option */}
                                    {(selectedVideoId === video.id) && (
                                        <div className="w-max py-2 bg-[#282828] rounded-md border border-white/10 text-sm absolute top-full right-0 z-10 whitespace-nowrap">
                                            {/* Remove video from history (opens confirmation modal) */}
                                            <div onClick={() => setShowDeleteModal(true)}
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

            {/* Delete video modal */}
            {(showDeleteModal) && (
                <Modal type="danger" actionText="Remove"
                    title="Remove from History?"
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => {
                        removeVideoFromHistory(selectedVideoId)
                        setSelectedVideoId(null)
                        setShowDeleteModal(false)
                    }}
                />
            )}
        </div>
    )
}

export default History