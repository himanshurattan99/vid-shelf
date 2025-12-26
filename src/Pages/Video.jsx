import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import watch_later_icon from '../assets/icons/watch-later-icon.png'
import playlists_icon from '../assets/icons/playlists-icon.png'
import remove_icon from '../assets/icons/remove-icon.png'
import VideoPlayer from '../Components/VideoPlayer'
import Error from './Error'

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

                        {/* Add to Playlist (opens playlist selection modal) */}
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
                <div className="bg-black/50 flex justify-center items-start absolute inset-0 z-10">
                    <div className="mt-16 p-5 bg-[#212121] border border-white/10 rounded-lg">
                        <h3 className="mb-5 text-lg font-medium">Delete this video?</h3>

                        <div className="flex justify-center gap-5">
                            {/* Cancel deletion */}
                            <button onClick={() => setShowDeleteModal(false)}
                                className="py-1 px-3 hover:bg-[#3c3c3c] rounded-full cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>

                            {/* Confirm delete and close modal */}
                            <button onClick={() => {
                                removeVideo(video.id)
                                setShowDeleteModal(false)
                                navigate('/') // Redirect to Home page after deletion
                            }}
                                className="py-1 px-3 bg-red-600 hover:bg-red-700 rounded-full cursor-pointer transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Playlist selection modal */}
            {(showPlaylistModal) && (
                <div className="bg-black/50 flex justify-center items-start absolute inset-0 z-10">
                    <div className="w-64 mt-16 p-5 bg-[#212121] border border-white/10 rounded-xl">
                        <h3 className="mb-3 font-semibold text-slate-100">Add to Playlist</h3>

                        {/* List of playlists */}
                        <div className="max-h-60 mb-3 overflow-y-auto">
                            {Object.values(playlists).map((playlist) => (
                                <div key={playlist.id}
                                    onClick={() => {
                                        addVideoToPlaylist(playlist.id, video.id)
                                        setShowPlaylistModal(false)
                                    }}
                                    className="py-2.5 px-3 hover:bg-[#2a2a2a] rounded-lg flex justify-between items-center cursor-pointer transition-colors"
                                >
                                    <div className="text-sm text-slate-200">
                                        {playlist.name}
                                    </div>
                                    {/* Show playlist icon if video is already in this playlist */}
                                    {(playlist.videoIds.includes(video.id)) && (
                                        <img src={playlists_icon} className="w-4" alt="" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="h-px mb-3 bg-white/5"></div>

                        {/* Cancel button */}
                        <button onClick={() => setShowPlaylistModal(false)}
                            className="w-full py-2 px-3 hover:bg-[#2a2a2a] rounded-lg text-sm text-slate-300 cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div >
    )
}

export default Video