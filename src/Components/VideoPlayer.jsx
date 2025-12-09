import { useState, useRef, useEffect } from 'react'
import { formatDuration } from '../utils'
import play_icon from '../assets/icons/play-icon.png'
import pause_icon from '../assets/icons/pause-icon.png'
import replay_icon from '../assets/icons/replay-icon.png'
import volume_icon from '../assets/icons/volume-icon.png'
import mute_icon from '../assets/icons/mute-icon.png'
import settings_icon from '../assets/icons/settings-icon.png'
import fullscreen_icon from '../assets/icons/fullscreen-icon.png'
import exit_fullscreen_icon from '../assets/icons/exit-fullscreen-icon.png'

const VideoPlayer = ({ video }) => {
    // References to video and container DOM elements
    const videoRef = useRef(null)
    const containerRef = useRef(null)

    // Core video playback state
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasEnded, setHasEnded] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    // Volume and audio controls
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)

    // Playback speed control
    const [playbackSpeed, setPlaybackSpeed] = useState(1)
    const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

    // UI visibility and interaction states
    const [showThumbnail, setShowThumbnail] = useState(true)
    const [showControls, setShowControls] = useState(false)
    const [showClickIcon, setShowClickIcon] = useState(false)
    const [showPlaybackSpeedMenu, setShowPlaybackSpeedMenu] = useState(false)

    // Fullscreen mode state
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Handle thumbnail click - start playing video
    const handleThumbnailClick = () => {
        setShowThumbnail(false)
        setIsPlaying(true)
    }

    // Toggle play/pause state
    const togglePlay = () => {
        setIsPlaying(!(isPlaying))

        // Show click icon briefly
        setShowClickIcon(true)
        setTimeout(() => setShowClickIcon(false), 500)
    }

    // Replay video from the beginning
    const replayVideo = () => {
        const video = videoRef.current
        if (!video) return

        video.currentTime = 0
        setCurrentTime(0)
        setHasEnded(false)
        setIsPlaying(true)

        // Show click icon briefly
        setShowClickIcon(true)
        setTimeout(() => setShowClickIcon(false), 500)
    }

    // Handle progress bar changes (seeking)
    const handleProgressChange = (e) => {
        const video = videoRef.current
        if (!video) return

        const newCurrentTime = parseFloat(e.target.value)
        video.currentTime = newCurrentTime
        setCurrentTime(newCurrentTime)

        // Check if video has ended by seeking to the end
        if (newCurrentTime >= duration) {
            setHasEnded(true)
            setIsPlaying(false)
        }
        // Reset ended state if seeking away from end
        else {
            setHasEnded(false)
        }
    }

    // Toggle mute/unmute state
    const toggleIsMuted = () => {
        setIsMuted(!(isMuted))
    }

    // Handle volume slider changes
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value)
        setVolume(newVolume)

        // Auto-mute when slider reaches 0
        if (newVolume === 0 && !isMuted) {
            setIsMuted(true)
        }

        // Auto-unmute when slider moves away from 0
        if (newVolume > 0 && isMuted) {
            setIsMuted(false)
        }
    }

    // Toggle playback speed menu visibility
    const toggleShowPlaybackMenu = () => {
        setShowPlaybackSpeedMenu(!(showPlaybackSpeedMenu))
    }

    // Set video playback speed and close menu
    const handlePlaybackSpeed = (speed) => {
        const video = videoRef.current
        if (!video) return

        const newPlaybackSpeed = parseFloat(speed)
        video.playbackRate = newPlaybackSpeed
        setPlaybackSpeed(newPlaybackSpeed)
    }

    // Toggle fullscreen mode
    const toggleFullscreen = () => {
        const container = containerRef.current

        // Enter fullscreen if not already in fullscreen mode
        if (!(document.fullscreenElement)) {
            container.requestFullscreen()
        }
        // Exit fullscreen if already in fullscreen mode
        else {
            document.exitFullscreen()
        }

        setIsFullscreen(!(isFullscreen))
    }

    // Handle keyboard shortcuts for video playback controls
    const handleVideoKeyDown = (e) => {
        const video = videoRef.current
        if (!video) return

        // Seek to a new time position within video bounds
        const seek = (offset) => {
            const newCurrentTime = Math.min(duration, Math.max(0, currentTime + offset))
            video.currentTime = newCurrentTime
            setCurrentTime(newCurrentTime)

            // Check if video has ended by seeking to the end
            if (newCurrentTime >= duration) {
                setHasEnded(true)
                setIsPlaying(false)
            }
            // Reset ended state if seeking away from end
            else {
                setHasEnded(false)
            }
        }

        // Adjust volume within bounds (0 to 1)
        const adjustVolume = (offset) => {
            const newVolume = Math.min(1, Math.max(0, volume + offset))
            setVolume(newVolume)

            // Auto-unmute when increasing volume
            if (offset > 0 && isMuted) {
                setIsMuted(false)
            }

            // Auto-mute when volume reaches 0
            if (newVolume === 0 && !(isMuted)) {
                setIsMuted(true)
            }
        }

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault() // Prevent page scroll
                seek(-10) // Seek backward 10 seconds
                break

            case 'ArrowRight':
                e.preventDefault()
                seek(10) // Seek forward 10 seconds
                break

            case 'ArrowUp':
                e.preventDefault() // Prevent page scroll
                adjustVolume(0.1) // Increase volume by 10%
                break

            case 'ArrowDown':
                e.preventDefault()
                adjustVolume(-0.1) // Decrease volume by 10%
                break

            case ' ': // Space bar for play/pause
                e.preventDefault()
                if (hasEnded) {
                    replayVideo()
                } else {
                    togglePlay()
                }
                break

            case 'm': // 'M' key for mute/unmute
            case 'M':
                e.preventDefault()
                toggleIsMuted()
                break
        }
    }

    // Set up video event listeners for duration and time updates
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        // Update duration when video metadata loads
        const updateDuration = () => setDuration(video.duration)
        // Update current time during playback
        const updateTime = () => setCurrentTime(video.currentTime)
        // Handle video end event
        const handleVideoEnd = () => {
            setHasEnded(true)
            setIsPlaying(false)
        }
        // Update fullscreen state when fullscreen mode changes
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)

        video.addEventListener('loadedmetadata', updateDuration)
        video.addEventListener('timeupdate', updateTime)
        video.addEventListener('ended', handleVideoEnd)
        document.addEventListener('fullscreenchange', handleFullscreenChange)

        // Cleanup event listeners
        return () => {
            video.removeEventListener('loadedmetadata', updateDuration)
            video.removeEventListener('timeupdate', updateTime)
            video.removeEventListener('ended', handleVideoEnd)
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    }, [])

    // Handle play/pause video based on state
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying && !(showThumbnail)) {
            video.play()
        } else {
            video.pause()
        }
    }, [isPlaying, showThumbnail])

    // Update video volume based on volume and mute state
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        video.volume = isMuted ? 0 : volume
    }, [volume, isMuted])

    return (
        <div onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}
            onKeyDown={handleVideoKeyDown}
            ref={containerRef}
            tabIndex={0}
            className="outline-none relative"
        >
            {/* Video element - always render but control visibility */}
            <video onClick={(hasEnded) ? replayVideo : togglePlay}
                src={video.url} ref={videoRef}
                preload="metadata"
                className={`w-full aspect-video ${(showThumbnail) ? 'hidden' : 'block'}`}
            />

            {/* Thumbnail overlay - conditionally rendered */}
            {(showThumbnail) && (
                <div className="">
                    <img src={video.thumbnail} className="w-full aspect-video lg:rounded-xl" alt="" />
                    <div className="bg-black/50 lg:rounded-xl absolute inset-0">
                        <img onClick={handleThumbnailClick} src={play_icon} className="w-1/10 sm:w-1/12 lg:w-1/16 cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 hover:rotate-360" alt="" />
                    </div>
                </div>
            )}

            {/* Brief play/pause icon display on video click */}
            {(showClickIcon && !(showThumbnail)) && (
                <div className="p-3 bg-black/50 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping">
                    <img src={(isPlaying) ? play_icon : pause_icon}
                        className="size-6 animate-pulse" alt="" />
                </div>
            )}

            {/* Video controls overlay */}
            {(showControls && !(showThumbnail)) &&
                (
                    <div className="absolute right-0 bottom-2 left-0">
                        {/* Progress bar */}
                        <div className="">
                            <input onChange={handleProgressChange} type="range"
                                value={currentTime} min="0" max={duration} step={1 / duration}
                                className="w-full cursor-pointer media-slider media-slider-red"
                                style={{
                                    background: `linear-gradient(to right, #065fd4 0%, #065fd4 ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                                }}
                            />
                        </div>

                        {/* Control buttons and info */}
                        <div className="py-1 px-3 flex items-center gap-5">
                            {/* Play/Pause button */}
                            <button onClick={(hasEnded) ? replayVideo : togglePlay} className="w-6 cursor-pointer transition-transform hover:rotate-360">
                                <img src={(hasEnded) ? replay_icon : ((isPlaying) ? pause_icon : play_icon)} alt="" />
                            </button>

                            {/* Volume control section */}
                            <div className="flex items-center gap-1 cursor-pointer">
                                {/* Volume/Mute button */}
                                <img onClick={toggleIsMuted} src={(isMuted) ? mute_icon : volume_icon} className="w-6" alt="" />

                                {/* Volume slider */}
                                <input onChange={(e) => handleVolumeChange(e)} type="range"
                                    value={(isMuted) ? 0 : volume} min="0" max="1" step="0.025"
                                    className="w-18 cursor-pointer media-slider media-slider-white"
                                    style={{
                                        background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(isMuted) ? 0 : volume * 100}%, rgba(255, 255, 255, 0.2) ${(isMuted) ? 0 : volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                                    }}
                                />
                            </div>

                            {/* Current time and duration display */}
                            <div className="text-sm">
                                {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
                            </div>

                            {/* Playback speed control button */}
                            <button className="ml-auto relative">
                                <img onClick={toggleShowPlaybackMenu}
                                    src={settings_icon}
                                    className="w-6 transition-transform duration-250 hover:rotate-360 cursor-pointer" alt=""
                                />

                                {(showPlaybackSpeedMenu && !(showThumbnail)) &&
                                    (
                                        <div className="bg-black/50 rounded-md overflow-hidden absolute -top-[100%] left-[50%] -translate-x-[50%] -translate-y-[100%]">
                                            {/* Playback speed slider */}
                                            <div className="py-1 px-2">
                                                <div className="">{playbackSpeed}x</div>

                                                <input onChange={(e) => handlePlaybackSpeed(e.target.value)} type="range"
                                                    value={playbackSpeed} min="0.05" max="2" step="0.05"
                                                    className="w-21 cursor-pointer media-slider media-slider-white"
                                                    style={{
                                                        background: `linear-gradient(to right, #ffffff 0%, #ffffff ${((playbackSpeed) / 2) * 100}%, rgba(255, 255, 255, 0.2) ${((playbackSpeed) / 2) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                                                    }}
                                                />
                                            </div>

                                            {playbackSpeeds.map((speed) => {
                                                return (
                                                    <div onClick={() => handlePlaybackSpeed(speed)}
                                                        key={speed}
                                                        className={`py-1 px-6 ${(playbackSpeed === speed) ? 'bg-black/50' : ''} hover:bg-black/50 text-sm cursor-pointer`}
                                                    >
                                                        {speed}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                            </button>

                            {/* Toggle fullscreen button */}
                            <button onClick={toggleFullscreen} className="cursor-pointer">
                                <img src={(isFullscreen) ? exit_fullscreen_icon : fullscreen_icon} className="w-6 transition-transform duration-250 hover:scale-105" alt="" />
                            </button>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default VideoPlayer