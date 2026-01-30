import { useState, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import favourites_icon from '../assets/icons/favourites-icon.png'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import playlists_icon from '../assets/icons/playlists-icon.png'
import subtitles_icon from '../assets/icons/subtitles-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import more_options_icon from '../assets/icons/more-options-icon.png'
import VideoPlayer from '../Components/VideoPlayer'
import Error from './Error'
import Modal from '../Components/Modal'
import { isVideoInPlaylist, formatDuration } from '../utils'

const Video = ({ videos, deleteVideo, playlists, saveVideoToPlaylist, removeVideoFromPlaylist, addVideoToHistory, updateVideoThumbnail, addVideoSubtitles, updateVideoProgress }) => {
    const navigate = useNavigate()

    // Extract video ID and playlist ID from URL query parameters
    const [searchParams] = useSearchParams()
    const videoId = searchParams.get('v')
    const playlistId = searchParams.get('p') // Only present when opened from a playlist, not Home/Library

    // Retrieve video object from videos map using videoId
    const video = videos[videoId]

    // Track if user has actively played a video in this session to enable autoplay for subsequent videos
    const hasPlayedVideo = useRef(false)
    // Reference to the hidden subtitles file input element
    const subtitlesInputRef = useRef(null)

    // Retrieve playlist object from playlists map using playlistId
    const playlist = playlists[playlistId]
    // Retrieve video IDs from playlist and map them to full video objects
    const videoIds = playlist?.videoIds || []
    const playlistVideosArray = videoIds.map((videoId) => videos[videoId] || { id: videoId })

    // State to toggle Delete from Library confirmation modal
    const [showDeleteFromLibraryModal, setShowDeleteFromLibraryModal] = useState(false)
    // State to toggle Playlist Selector modal
    const [showPlaylistSelectorModal, setShowPlaylistSelectorModal] = useState(false)
    // State to track which video's option menu is open in the playlist sidebar
    const [selectedPlaylistVideoId, setSelectedPlaylistVideoId] = useState(null)
    // State to toggle Remove from Playlist confirmation modal
    const [showRemoveFromPlaylistModal, setShowRemoveFromPlaylistModal] = useState(false)

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
                    <VideoPlayer key={videoId}
                        video={video}
                        autoPlay={hasPlayedVideo.current}
                        onPlayStart={() => hasPlayedVideo.current = true}
                        addVideoToHistory={addVideoToHistory}
                        updateVideoThumbnail={updateVideoThumbnail}
                        updateVideoProgress={updateVideoProgress}
                    />
                </div>

                <div className="flex justify-between items-start">
                    {/* Video name */}
                    <h2 className="text-lg sm:text-xl font-medium">{video?.name}</h2>

                    {/* Video action buttons: Favourites, Watch Later, Save/Remove from Playlist, Delete Video */}
                    <div className="flex gap-5">
                        {/* Add/Remove video to Favourites */}
                        <button onClick={() => {
                            if (isVideoInPlaylist(video.id, 'favourites', playlists)) {
                                removeVideoFromPlaylist('favourites', video.id)
                            } else {
                                saveVideoToPlaylist('favourites', video.id)
                            }
                        }}
                            className={`py-1 px-3 bg-[#2e2e2e] hover:bg-[#3e3e3e] hover:opacity-80 rounded-full cursor-pointer transition-opacity ${(isVideoInPlaylist(video.id, 'favourites', playlists)) ? 'border border-gray-500' : ''}`}
                            title={(isVideoInPlaylist(video.id, 'favourites', playlists)) ? "Remove from Favourites" : "Add to Favourites"}
                        >
                            <img src={favourites_icon} className="w-6" alt="Favourites" />
                        </button>

                        {/* Add/Remove video to Watch Later */}
                        <button onClick={() => {
                            if (isVideoInPlaylist(video.id, 'watch_later', playlists)) {
                                removeVideoFromPlaylist('watch_later', video.id)
                            } else {
                                saveVideoToPlaylist('watch_later', video.id)
                            }
                        }}
                            className={`py-1 px-3 bg-[#2e2e2e] hover:bg-[#3e3e3e] hover:opacity-80 rounded-full cursor-pointer transition-opacity ${(isVideoInPlaylist(video.id, 'watch_later', playlists)) ? 'border border-gray-500' : ''}`}
                            title={(isVideoInPlaylist(video.id, 'watch_later', playlists)) ? "Remove from Watch Later" : "Add to Watch Later"}
                        >
                            <img src={watch_later_icon} className="w-6" alt="Watch Later" />
                        </button>

                        {/* Save/Remove from Playlist (opens Playlist Selector modal) */}
                        <button onClick={() => setShowPlaylistSelectorModal(true)}
                            className="py-1 px-3 bg-[#2e2e2e] hover:bg-[#3e3e3e] hover:opacity-80 rounded-full cursor-pointer transition-opacity"
                            title="Save/Remove from playlist"
                        >
                            <img src={playlists_icon} className="w-6" alt="Playlists" />
                        </button>

                        {/* Hidden file input for importing subtitles */}
                        <input onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                addVideoSubtitles(videoId, e.target.files[0])
                            }
                        }}
                            ref={subtitlesInputRef}
                            type="file" accept=".vtt"
                            className="hidden"
                        />
                        {/* Add subtitles button */}
                        <button onClick={() => subtitlesInputRef.current.click()}
                            className="py-1 px-3 bg-[#2e2e2e] hover:bg-[#3e3e3e] hover:opacity-80 rounded-full cursor-pointer transition-opacity"
                            title="Add Subtitles"
                        >
                            <img src={subtitles_icon} className="w-6" alt="Subtitles" />
                        </button>

                        {/* Delete video (opens Delete from Library confirmation modal) */}
                        <button onClick={() => setShowDeleteFromLibraryModal(true)}
                            className="py-1 px-3 bg-[#2e2e2e] hover:bg-[#3e3e3e] hover:opacity-80 rounded-full cursor-pointer transition-opacity"
                            title="Delete Video"
                        >
                            <img src={remove_icon} className="w-6" alt="Delete Video" />
                        </button>
                    </div>
                </div>
            </div>


            {/* Playlist Videos (only shown if playlistId is present) */}
            {(playlistId) && (
                <div className="lg:max-h-full -mx-1 lg:mx-0 py-2 lg:py-3 px-3 border border-[#3d3d3d] rounded-xl lg:flex-1 flex flex-col gap-1 overflow-y-auto">
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-lg sm:text-xl font-medium">{playlist?.name}</h2>
                        <div className="text-sm text-slate-500">{playlist?.videoIds.length} videos</div>
                    </div>

                    {playlistVideosArray.map((video) => {
                        return (
                            <Link key={video.id} to={`/watch?v=${video.id}&p=${playlistId}`}>
                                <div className={`p-2 ${(video.id === videoId) ? 'bg-[#2e2e2e]' : ''} hover:bg-[#2e2e2e] rounded-lg flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 cursor-pointer transition-colors`}>
                                    {/* Video thumbnail with duration overlay */}
                                    <div className="sm:w-[40%] aspect-video rounded-lg shrink-0 relative overflow-hidden">
                                        <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt="" />
                                        <span className="px-1 bg-black opacity-75 rounded text-sm lg:text-xs text-white absolute bottom-1 right-1">
                                            {formatDuration(video.duration)}
                                        </span>
                                        {/* Progress Bar Overlay */}
                                        {(video.progress > 0) && (
                                            <div className="h-1 bg-[#007fff] rounded-lg absolute bottom-0 left-0" style={{ width: `${(video.progress / video.duration) * 100}%` }}></div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex justify-between">
                                        {/* Video name */}
                                        <h3 className="lg:text-sm font-medium line-clamp-2">{video.name}</h3>

                                        <div className="relative">
                                            {/* Toggle dropdown menu for this video */}
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setSelectedPlaylistVideoId((selectedPlaylistVideoId === video.id) ? null : video.id)
                                            }}
                                                className="w-5 hover:bg-[#3c3c3c] rounded-full shrink-0 cursor-pointer"
                                            >
                                                <img src={more_options_icon} alt="" />
                                            </button>

                                            {/* Dropdown menu: Remove Video option */}
                                            {(selectedPlaylistVideoId === video.id) && (
                                                <div className="w-max py-2 bg-[#282828] rounded-md border border-white/20 text-xs absolute top-full right-0 z-10 whitespace-nowrap">
                                                    {/* Remove video from playlist (opens confirmation modal) */}
                                                    <div onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        setShowRemoveFromPlaylistModal(true)
                                                    }}
                                                        className="px-2 py-1 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-1"
                                                    >
                                                        <img src={remove_icon} className="w-4" alt="" />
                                                        <span>Remove from {playlist.name}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}

            {/* Delete video from Library modal */}
            {(showDeleteFromLibraryModal) && (
                <Modal type="delete-video"
                    title="Delete from Library?"
                    onClose={() => setShowDeleteFromLibraryModal(false)}
                    onConfirm={() => {
                        deleteVideo(videoId)
                        setShowDeleteFromLibraryModal(false)
                        navigate('/') // Redirect to Home page after deletion
                    }}
                />
            )}

            {/* Save/Remove video via Playlist Selector modal */}
            {(showPlaylistSelectorModal) && (
                <Modal type="playlist-selector"
                    title="Select Playlist"
                    onClose={() => setShowPlaylistSelectorModal(false)}
                    onConfirm={(playlistId) => {
                        if (isVideoInPlaylist(videoId, playlistId, playlists)) {
                            removeVideoFromPlaylist(playlistId, videoId)
                        } else {
                            saveVideoToPlaylist(playlistId, videoId)
                        }
                    }}
                    playlists={playlists}
                    videoId={videoId}
                />
            )}

            {/* Remove video from Playlist modal */}
            {(showRemoveFromPlaylistModal) && (
                <Modal type="delete-video"
                    title="Remove from playlist?"
                    onClose={() => setShowRemoveFromPlaylistModal(false)}
                    onConfirm={() => {
                        removeVideoFromPlaylist(playlistId, selectedPlaylistVideoId)
                        setSelectedPlaylistVideoId(null)
                        setShowRemoveFromPlaylistModal(false)
                        // Redirect to Playlist page if the currently playing video is removed
                        if (selectedPlaylistVideoId === videoId) {
                            navigate(`/playlist?p=${playlistId}`)
                        }
                    }}
                />
            )}
        </div >
    )
}

export default Video