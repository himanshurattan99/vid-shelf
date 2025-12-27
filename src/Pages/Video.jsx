import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import playlists_icon from '../assets/icons/playlists-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import VideoPlayer from '../Components/VideoPlayer'
import Error from './Error'
import Modal from '../Components/Modal'

const Video = ({ videos, removeVideo, playlists, addVideoToPlaylist }) => {
    // Extract video ID from URL query parameters
    const [searchParams] = useSearchParams()
    const videoId = searchParams.get('v')

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
        <div className="h-[92.5vh] p-3 lg:py-6 lg:pr-6 lg:pl-24 bg-[#181818] text-slate-100 flex-1 flex flex-col lg:flex-row lg:justify-between gap-5 lg:gap-0 overflow-y-auto">
            {/* Main video content container */}
            <div className="lg:w-[64%] flex flex-col gap-2 sm:gap-3">
                <div className="-mx-3 lg:mx-0 aspect-video relative">
                    <VideoPlayer video={video} />
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