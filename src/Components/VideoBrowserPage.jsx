import { useState } from 'react'
import { CheckSquare } from 'lucide-react'
import VideoGrid from './VideoGrid'

const VideoBrowserPage = ({
    title,
    displayedVideos,
    emptyState,
    headerClassName = 'mb-3 flex justify-between items-center',
    topNotice = null,
    renderSelectionActions,
    renderDefaultActions,
    onVideoOpen,
    onUnavailableClick,
    renderMenu,
    renderModals
}) => {
    // State to track which video's option menu is open
    const [selectedVideoId, setSelectedVideoId] = useState(null)
    // State variables for batch actions (multi-select)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedVideoIds, setSelectedVideoIds] = useState([])

    // Shared page state passed to page-specific render props and handlers
    const pageState = {
        selectedVideoId,
        setSelectedVideoId,
        isSelectionMode,
        setIsSelectionMode,
        selectedVideoIds,
        setSelectedVideoIds
    }

    // Show page-specific empty state message when there are no videos
    if (displayedVideos.length === 0) {
        return emptyState
    }

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            {/* Page header with title and selection-mode actions */}
            <div className={headerClassName}>
                <h2 className="text-xl font-bold">
                    {title}
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

                            {renderSelectionActions?.(pageState)}
                        </>
                    ) : (
                        <>
                            {/* Enter Selection Mode */}
                            <button
                                onClick={() => setIsSelectionMode(true)}
                                className="py-1.5 px-4 bg-[#282828] hover:bg-[#3d3d3d] rounded-full text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                <CheckSquare className="w-4" />
                                <span>Select</span>
                            </button>

                            {renderDefaultActions?.(pageState)}
                        </>
                    )}
                </div>
            </div>

            {/* Optional page notice shown above the video grid */}
            {topNotice}

            {/* Video grid with page-specific interactions */}
            <VideoGrid
                displayedVideos={displayedVideos}
                onCardClick={(video, isSelected) => {
                    if (isSelectionMode) {
                        // Toggle video selection
                        setSelectedVideoIds((isSelected) ?
                            selectedVideoIds.filter((id) => id !== video.id)
                            : [...selectedVideoIds, video.id]
                        )
                    } else {
                        // Normal click: open video page
                        onVideoOpen(video, pageState)
                    }
                }}
                onUnavailableClick={(video) => onUnavailableClick?.(video, pageState)}
                selectedVideoId={selectedVideoId}
                onToggleMenu={(videoId) => {
                    setSelectedVideoId((selectedVideoId === videoId) ? null : videoId)
                }}
                renderMenu={() => renderMenu?.(pageState)}
                isSelectionMode={isSelectionMode}
                selectedVideoIds={selectedVideoIds}
            />

            {/* Page-specific confirmation and selector modals */}
            {renderModals?.(pageState)}
        </div>
    )
}

export default VideoBrowserPage