import { useState, useRef, useEffect, useMemo } from 'react'
import { formatDuration } from '../utils'
import play_icon from '../assets/icons/play-icon.png'
import pause_icon from '../assets/icons/pause-icon.png'
import replay_icon from '../assets/icons/replay-icon.png'
import volume_icon from '../assets/icons/volume-icon.png'
import mute_icon from '../assets/icons/mute-icon.png'
import thumbnail_icon from '../assets/icons/thumbnail-icon.png'
import subtitles_icon from '../assets/icons/subtitles-icon.png'
import fullscreen_icon from '../assets/icons/fullscreen-icon.png'
import exit_fullscreen_icon from '../assets/icons/exit-fullscreen-icon.png'
import Modal from './Modal'

const VideoPlayer = ({ video, autoPlay = false, onPlayStart, updateVideoThumbnail }) => {
    const { url, thumbnail, duration } = video

    // References to video, container, and video progress bar DOM elements
    const videoRef = useRef(null)
    const containerRef = useRef(null)
    const progressRef = useRef(null)
    // Reference to track if video was playing before capturing thumbnail
    const wasPlayingRef = useRef(false)

    // Core video playback state
    const [isPlaying, setIsPlaying] = useState(autoPlay)
    const [hasEnded, setHasEnded] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)

    // Memoize formatted duration to prevent re-calculation on every render
    const formattedDuration = useMemo(() => formatDuration(Math.floor(duration)), [duration])

    // Volume and audio controls
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)

    // Playback speed control
    const [playbackSpeed, setPlaybackSpeed] = useState(1)
    const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

    // UI visibility and interaction states
    const [showThumbnail, setShowThumbnail] = useState(!autoPlay)
    const [showControls, setShowControls] = useState(false)
    const [showClickIcon, setShowClickIcon] = useState(false)
    const [showThumbnailConfirmation, setShowThumbnailConfirmation] = useState(false)
    const [showSubtitles, setShowSubtitles] = useState(true)
    const [showPlaybackSpeedMenu, setShowPlaybackSpeedMenu] = useState(false)

    // Fullscreen mode state
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Handle thumbnail click - start playing video
    const handleThumbnailClick = () => {
        setShowThumbnail(false)
        setIsPlaying(true)

        // Notify parent component to enable autoplay for subsequent videos
        if (onPlayStart) onPlayStart()
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
        const videoElement = videoRef.current
        if (!videoElement) return

        videoElement.currentTime = 0
        setCurrentTime(0)
        setHasEnded(false)
        setIsPlaying(true)
        setShowControls(false)

        // Show click icon briefly
        setShowClickIcon(true)
        setTimeout(() => setShowClickIcon(false), 500)
    }

    // Handle progress bar changes (seeking)
    const handleProgressChange = (e) => {
        const videoElement = videoRef.current
        if (!videoElement) return

        const newCurrentTime = parseFloat(e.target.value)
        videoElement.currentTime = newCurrentTime
        setCurrentTime(newCurrentTime)

        // Update video progress bar visuals manually to stay in sync
        if (progressRef.current) {
            const progress = (newCurrentTime / duration) * 100
            progressRef.current.style.background = `linear-gradient(to right, #065fd4 0%, #065fd4 ${progress}%, rgba(255, 255, 255, 0.2) ${progress}%, rgba(255, 255, 255, 0.2) 100%)`
        }

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

    // Toggle subtitles
    const toggleSubtitles = () => {
        const videoElement = videoRef.current
        if (!videoElement || !videoElement.textTracks[0]) return

        const newMode = !showSubtitles
        videoElement.textTracks[0].mode = (newMode) ? 'showing' : 'hidden'
        setShowSubtitles(newMode)
    }

    // Toggle playback speed menu visibility
    const toggleShowPlaybackMenu = () => {
        setShowPlaybackSpeedMenu(!(showPlaybackSpeedMenu))
    }

    // Set video playback speed
    const handlePlaybackSpeed = (speed) => {
        const videoElement = videoRef.current
        if (!videoElement) return

        const newPlaybackSpeed = parseFloat(speed)
        videoElement.playbackRate = newPlaybackSpeed
        setPlaybackSpeed(newPlaybackSpeed)
    }

    // Capture current frame and set as thumbnail
    const captureThumbnail = () => {
        const videoElement = videoRef.current
        if (!videoElement) return

        // Create a canvas to draw the frame
        const canvas = document.createElement('canvas')
        canvas.width = videoElement.videoWidth
        canvas.height = videoElement.videoHeight

        const ctx = canvas.getContext('2d')
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

        // Convert canvas to blob and update thumbnail
        canvas.toBlob((blob) => {
            if (blob) {
                updateVideoThumbnail(video.id, blob)
            }
        }, 'image/jpeg', 0.8)
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
        const videoElement = videoRef.current
        if (!videoElement) return

        // Seek to a new time position within video bounds
        const seek = (offset) => {
            const newCurrentTime = Math.min(duration, Math.max(0, currentTime + offset))
            videoElement.currentTime = newCurrentTime
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

    // Set up video event listeners and drive the high-frequency progress update loop using requestAnimationFrame
    useEffect(() => {
        const videoElement = videoRef.current
        if (!videoElement) return

        let animationFrameId
        // Efficiently updates the video progress bar and throttles 'currentTime' state updates
        const updateLoop = () => {
            if (videoElement.paused || videoElement.ended) return

            const currentTime = videoElement.currentTime

            // Direct DOM manipulation for smooth progress bar (60fps, no re-renders)
            if (progressRef.current) {
                progressRef.current.value = currentTime
                const progress = (currentTime / duration) * 100
                progressRef.current.style.background = `linear-gradient(to right, #065fd4 0%, #065fd4 ${progress}%, rgba(255, 255, 255, 0.2) ${progress}%, rgba(255, 255, 255, 0.2) 100%)`
            }

            // Throttle 'currentTime' state updates to 1Hz (once per second) to minimize re-renders
            setCurrentTime((prev) => {
                if (Math.floor(currentTime) !== Math.floor(prev)) {
                    return currentTime
                }
                return prev
            })

            animationFrameId = requestAnimationFrame(updateLoop)
        }

        // Sync playing state and start the 60fps update loop
        const onPlay = () => {
            setIsPlaying(true) // Sync state (handles browser controls/keyboard shortcuts)
            updateLoop()
        }

        // Sync paused state and stop the update loop
        const onPause = () => {
            setIsPlaying(false) // Sync state (handles browser controls/keyboard shortcuts)
            cancelAnimationFrame(animationFrameId)
        }

        // Handle video end event
        const handleVideoEnd = () => {
            setHasEnded(true)
            setIsPlaying(false)
            setShowControls(true)
            cancelAnimationFrame(animationFrameId)
        }

        // Update fullscreen state when fullscreen mode changes
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)

        // Events to trigger the update loop
        videoElement.addEventListener('play', onPlay)
        videoElement.addEventListener('pause', onPause)
        videoElement.addEventListener('ended', handleVideoEnd)
        document.addEventListener('fullscreenchange', handleFullscreenChange)

        // Start update loop if video is already playing (handles component remount scenarios)
        if (!videoElement.paused) onPlay()

        // Cleanup: stop the video progress update loop and remove all the attached event listeners
        return () => {
            cancelAnimationFrame(animationFrameId)
            videoElement.removeEventListener('play', onPlay)
            videoElement.removeEventListener('pause', onPause)
            videoElement.removeEventListener('ended', handleVideoEnd)
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    }, [duration])

    // Handle play/pause video based on state
    useEffect(() => {
        const videoElement = videoRef.current
        if (!videoElement) return

        if (isPlaying && !(showThumbnail)) {
            videoElement.play()
        } else {
            videoElement.pause()
        }
    }, [isPlaying, showThumbnail])

    // Update video volume based on volume and mute state
    useEffect(() => {
        const videoElement = videoRef.current
        if (!videoElement) return

        videoElement.volume = (isMuted) ? 0 : volume
    }, [volume, isMuted])

    // Calculate video current time to initialize the progress bar correctly whenever controls re-mount on hover
    const currentVideoTime = (videoRef.current) ? videoRef.current.currentTime : 0
    const currentProgressPercentage = (currentVideoTime / duration) * 100

    return (
        <div onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}
            onKeyDown={handleVideoKeyDown}
            ref={containerRef}
            tabIndex={0}
            className="lg:rounded-xl outline-none relative overflow-hidden"
        >
            {/* Video element - always render but control visibility */}
            <video onClick={(hasEnded) ? replayVideo : togglePlay}
                src={url} ref={videoRef}
                preload="metadata"
                className={`w-full aspect-video ${(showThumbnail) ? 'hidden' : 'block'}`}
            >
                {(video.subtitles) && (
                    <track src={video.subtitles.src}
                        kind="captions"
                        label={video.subtitles.name}
                        default
                    />
                )}
            </video>

            {/* Thumbnail overlay - conditionally rendered */}
            {(showThumbnail) && (
                <div className="">
                    <img src={thumbnail} className="w-full aspect-video lg:rounded-xl" alt="" />
                    <div className="bg-black/50 lg:rounded-xl absolute inset-0">
                        <button onClick={handleThumbnailClick} className="w-full h-full flex justify-center items-center cursor-pointer">
                            <img src={play_icon} className="w-1/10 sm:w-1/12 lg:w-1/16 transition-transform hover:scale-125 hover:rotate-360" alt="Play Video" />
                        </button>
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
                    <div className="bg-black/35 absolute right-0 bottom-0 left-0">
                        {/* Progress bar */}
                        <div className="flex items-center">
                            <input onChange={handleProgressChange} type="range"
                                ref={progressRef}
                                defaultValue={currentVideoTime} min="0" max={duration} step="any"
                                className="w-full cursor-pointer media-slider media-slider-red"
                                style={{
                                    background: `linear-gradient(to right, #065fd4 0%, #065fd4 ${currentProgressPercentage}%, rgba(255, 255, 255, 0.2) ${currentProgressPercentage}%, rgba(255, 255, 255, 0.2) 100%)`
                                }}
                            />
                        </div>

                        {/* Control buttons and info */}
                        <div className="py-2 px-3 flex items-center gap-5">
                            {/* Play/Pause button */}
                            <button onClick={(hasEnded) ? replayVideo : togglePlay} className="w-6 cursor-pointer transition-transform hover:rotate-360">
                                <img src={(hasEnded) ? replay_icon : ((isPlaying) ? pause_icon : play_icon)} alt="" />
                            </button>

                            {/* Volume control section */}
                            <div className="flex items-center gap-1 cursor-pointer">
                                {/* Volume/Mute button */}
                                <button onClick={toggleIsMuted} className="outline-none">
                                    <img src={(isMuted) ? mute_icon : volume_icon} className="w-6" alt="" />
                                </button>

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
                                {formatDuration(Math.floor(currentTime))} / {formattedDuration}
                            </div>

                            {/* Capture Thumbnail Button */}
                            <button onClick={() => {
                                const videoElement = videoRef.current
                                if (!videoElement) return

                                // Store current playing state and pause video
                                wasPlayingRef.current = !videoElement.paused
                                if (!videoElement.paused) {
                                    videoElement.pause()
                                    setIsPlaying(false)
                                }

                                setShowThumbnailConfirmation(true)
                            }}
                                className="ml-auto p-1 hover:bg-white/30 rounded-full cursor-pointer relative transition-colors" title="Set as Thumbnail"
                            >
                                <img src={thumbnail_icon} className="w-6" alt="Set Thumbnail" />
                            </button>

                            {/* Toggle subtitles button */}
                            {(video.subtitles) && (
                                <button onClick={toggleSubtitles}
                                    className={`p-1 ${(showSubtitles) ? 'bg-white/30' : 'hover:bg-white/30'} rounded-full cursor-pointer relative transition-colors`}
                                    title="Toggle Subtitles"
                                >
                                    <img src={subtitles_icon} className="w-6" alt="Subtitles" />
                                </button>
                            )}

                            {/* Playback speed control button */}
                            <button className="relative">
                                <div onClick={toggleShowPlaybackMenu}
                                    className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium cursor-pointer transition-colors"
                                >
                                    {playbackSpeed}x
                                </div>

                                {/* Playback speed menu */}
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
                                                    <button onClick={() => {
                                                        handlePlaybackSpeed(speed)
                                                        setShowPlaybackSpeedMenu(false)
                                                    }}
                                                        key={speed}
                                                        className={`w-full py-1 px-6 ${(playbackSpeed === speed) ? 'bg-black/50' : ''} hover:bg-black/50 text-sm cursor-pointer`}
                                                    >
                                                        {speed}
                                                    </button>
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

            {/* Thumbnail Update Confirmation Modal */}
            {(showThumbnailConfirmation) && (
                <Modal type="confirm-action"
                    title="Update video thumbnail to current frame?"
                    onClose={() => {
                        setShowThumbnailConfirmation(false)
                        // Resume video if it was playing before capture
                        if (wasPlayingRef.current) {
                            const videoElement = videoRef.current
                            if (videoElement) {
                                videoElement.play()
                                setIsPlaying(true)
                            }
                        }
                    }}
                    onConfirm={() => {
                        captureThumbnail()
                        setShowThumbnailConfirmation(false)
                        // Resume video if it was playing before capture
                        if (wasPlayingRef.current) {
                            const videoElement = videoRef.current
                            if (videoElement) {
                                videoElement.play()
                                setIsPlaying(true)
                            }
                        }
                    }}
                />
            )}
        </div>
    )
}

export default VideoPlayer