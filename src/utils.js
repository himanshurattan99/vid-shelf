// Helper function to remove file extension from filename
export const removeFileExtension = (fileName) => {
    return fileName.replace(/\.[^/.]+$/, "")
}

// Helper function to extract unique video ID from blob URL
export const extractVideoId = (videoUrl) => {
    return videoUrl.split("/").pop()
}

// Helper function to get video duration
export const getVideoDuration = (videoUrl) => {
    return new Promise((resolve) => {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.onloadedmetadata = () => {
            resolve(video.duration)
        }
        video.onerror = () => {
            resolve(0)
        }
        video.src = videoUrl
    })
}

// Helper function to format video duration
export const formatDuration = (seconds) => {
    if (!seconds) return "00:00"

    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, "0")

    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`
    }
    return `${mm}:${ss}`
}

// Helper function to shuffle an array
export const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled
}

// Helper function to generate video thumbnail
export const generateThumbnail = (videoUrl) => {
    return new Promise((resolve) => {
        const video = document.createElement('video')
        video.src = videoUrl
        video.currentTime = 1 // Capture video frame at 1 second mark
        video.preload = 'metadata'

        video.onloadeddata = () => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            canvas.toBlob((blob) => {
                const thumbnailUrl = URL.createObjectURL(blob)
                resolve(thumbnailUrl)
            }, 'image/jpeg')
        }

        video.onerror = () => {
            resolve(null)
        }
    })
}