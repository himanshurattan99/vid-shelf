import { MoreVertical } from 'lucide-react'
import { formatDuration } from '../utils'

const VideoGrid = ({ displayedVideos, onCardClick, onUnavailableClick, selectedVideoId = null, onToggleMenu, renderMenu, isSelectionMode = false, selectedVideoIds = [] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
            {displayedVideos.map((video) => {
                // Show a placeholder card when the backing video file is no longer available
                if (!video.url) {
                    return (
                        <div
                            key={video.id}
                            onClick={() => onUnavailableClick?.(video)}
                            className="aspect-video bg-[#282828] hover:bg-[#333] rounded-lg text-sm text-white/20 hover:text-slate-100 flex justify-center items-center cursor-pointer transition-colors"
                        >
                            Video Unavailable
                        </div>
                    )
                }

                // Determine if the current video is selected for batch actions
                const isSelected = selectedVideoIds.includes(video.id)

                return (
                    <div
                        key={video.id}
                        onClick={() => onCardClick(video, isSelected)}
                        className={`hover:bg-[#212121] rounded-lg transition-colors cursor-pointer ${(isSelected) ? 'bg-[#2a2a2a] ring-2 ring-[#007fff]' : ''}`}
                    >
                        {/* Thumbnail card with duration, progress, and selection overlays */}
                        <div className="rounded-lg relative overflow-hidden">
                            <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt={video.name} />
                            <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                {formatDuration(video.duration)}
                            </span>
                            {(video.progress > 0) && (
                                <div className="h-1 bg-[#007fff] rounded-lg absolute bottom-0 left-0" style={{ width: `${(video.progress / video.duration) * 100}%` }}></div>
                            )}
                            {(isSelectionMode) && (
                                <div className={`w-5 h-5 border-2 rounded-full ${(isSelected) ? 'bg-[#007fff] border-[#007fff]' : 'bg-black/50 border-white/50'} flex items-center justify-center absolute top-2 left-2 transition-colors`}>
                                    {(isSelected) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                            )}
                        </div>

                        <div className="py-1 ps-2 flex justify-between items-start gap-2">
                            <h3 className="text-sm font-medium leading-5 line-clamp-2">{video.name}</h3>

                            <div className="relative">
                                {/* Toggle dropdown menu button for this video (Hidden in selection mode) */}
                                {(!isSelectionMode) && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onToggleMenu(video.id)
                                        }}
                                        className="p-0.5 hover:bg-[#3c3c3c] rounded-full shrink-0 cursor-pointer"
                                        aria-label="More Options"
                                    >
                                        <MoreVertical className="size-5" />
                                    </button>
                                )}

                                {/* Dropdown menu for this video */}
                                {(selectedVideoId === video.id && !isSelectionMode) && (
                                    renderMenu?.()
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default VideoGrid