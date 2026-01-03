import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import playlists_icon from '../assets/icons/playlists-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import VideoPlayer from '../Components/VideoPlayer'
import Error from './Error'
import Modal from '../Components/Modal'
import { formatDuration } from '../utils'

const Video = ({ videos, removeVideo, playlists, addVideoToPlaylist }) => {
    // Extract video ID and playlist ID from URL query parameters
    const [searchParams] = useSearchParams()
    const videoId = searchParams.get('v')
    const playlistId = searchParams.get('p') // Only present when opened from a playlist, not Home/Library

    // Retrieve playlist object from playlists map using playlistId
    const playlist = playlists[playlistId]
    // Retrieve video IDs from playlist and map them to full video objects
    const videoIds = playlist?.videoIds || []
    const playlistVideosArray = videoIds.map((videoId) => videos[videoId] || { id: videoId })

    const navigate = useNavigate()

    // State to toggle delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    // State to toggle playlist selection modal
    const [showPlaylistModal, setShowPlaylistModal] = useState(false)

    // Retrieve video object from videos map using videoId
    const video = videos[videoId]

    // Show Error page when video ID parameter is missing
    if (!videoId) {
        return (
            <Error errorCode='400' errorMessage='Hey! Tell us which video you want to watch!' />
        )
    }
    // Show Error page when video doesn't exist or is not found
    if (!video) {
        return (
            <Error errorCode='400' errorMessage="Oops! This video doesn't exist or went missing!" />
        )
    }

    return (
        <div className="h-[92.5vh] p-3 lg:px-6 bg-[#181818] text-slate-100 flex-1 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-5 lg:gap-6 overflow-y-auto">
            {/* Main video content container */}
            <div className={`lg:w-[70%] ${(!playlistId) ? 'lg:ml-9' : ''} flex flex-col gap-2 sm:gap-3`}>
                <div className="-mx-3 lg:mx-0 aspect-video relative">
                    <VideoPlayer key={videoId} video={video} />
                </div>

                <div className="flex justify-between items-start">
                    {/* Video title */}
                    <h2 className="text-lg sm:text-xl font-medium">{video?.name}</h2>

                    {/* Video action buttons: Watch Later, Add to Playlist, Remove Video */}
                    <div className="flex gap-5">
                        {/* Add video to Watch Later */}
                        <button onClick={() => addVideoToPlaylist('watch_later', video.id)}
                            className="py-1 px-3 bg-[#2e2e2e] hover:bg-[#3e3e3e] hover:opacity-80 rounded-full cursor-pointer transition-opacity"
                            title="Add to Watch Later"
                        >
                            <img src={watch_later_icon} className="w-6" alt="Watch Later" />
                        </button>

                        {/* Save to Playlist (opens playlist selection modal) */}
                        <button onClick={() => setShowPlaylistModal(true)}
                            className="py-1 px-3 bg-[#2e2e2e] hover:bg-[#3e3e3e] hover:opacity-80 rounded-full cursor-pointer transition-opacity"
                            title="Save to Playlist"
                        >
                            <img src={playlists_icon} className="w-6" alt="Playlists" />
                        </button>

                        {/* Remove video (opens confirmation modal) */}
                        <button onClick={() => setShowDeleteModal(true)}
                            className="py-1 px-3 bg-[#2e2e2e] hover:bg-[#3e3e3e] hover:opacity-80 rounded-full cursor-pointer transition-opacity"
                            title="Remove Video"
                        >
                            <img src={remove_icon} className="w-6" alt="Remove Video" />
                        </button>
                    </div>
                </div>
            </div>


            {/* Playlist Videos (only shown if playlistId is present) */}
            {(playlistId) && (
                <div className="lg:max-h-full -mx-1 lg:mx-0 py-2 lg:py-3 px-3 border border-[#3d3d3d] rounded-xl lg:flex-1 flex flex-col gap-3 overflow-y-auto">
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-lg sm:text-xl font-medium">{playlist?.name}</h2>
                        <div className="text-sm text-slate-500">{playlist?.videoIds.length} videos</div>
                    </div>

                    {playlistVideosArray.map((video) => {
                        return (
                            <Link key={video.id} to={`/watch?v=${video.id}&p=${playlistId}`}>
                                <div className={`${(video.id === videoId) ? 'bg-[#2e2e2e]' : ''} hover:bg-[#2e2e2e] rounded-lg flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 cursor-pointer transition-colors`}>
                                    {/* Video thumbnail with duration overlay */}
                                    <div className="sm:w-[40%] aspect-video shrink-0 relative">
                                        <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt="" />
                                        <span className="px-1 bg-black opacity-75 rounded text-sm lg:text-xs text-white absolute bottom-1 right-1">
                                            {formatDuration(video.duration)}
                                        </span>
                                    </div>

                                    {/* Video name */}
                                    <h3 className="md:mt-2 lg:mt-1 lg:text-sm font-medium line-clamp-2">{video.name}</h3>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}

            {/* Delete video modal */}
            {(showDeleteModal) && (
                <Modal type="delete-video"
                    title="Delete this video?"
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => {
                        removeVideo(videoId)
                        setShowDeleteModal(false)
                        navigate('/') // Redirect to Home page after deletion
                    }}
                />
            )}

            {/* Playlist selection modal */}
            {(showPlaylistModal) && (
                <Modal type="save-to-playlist"
                    title="Save to Playlist"
                    onClose={() => setShowPlaylistModal(false)}
                    onConfirm={(playlistId) => {
                        addVideoToPlaylist(playlistId, videoId)
                        setShowPlaylistModal(false)
                    }}
                    playlists={playlists}
                    videoId={videoId}
                />
            )}
        </div >
    )
}

export default Video