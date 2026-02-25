// Helper function to remove file extension from filename
export const removeFileExtension = (fileName) => {
    return fileName.replace(/\.[^/.]+$/, "")
}

// Helper function to generate a random ID
export const generateId = (length = 7) => {
    return Math.random().toString(36).substring(2, 2 + length)
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

// Helper function to check if a video is in a specific playlist
export const isVideoInPlaylist = (videoId, playlistId, playlists) => {
    return playlists[playlistId]?.videoIds?.includes(videoId)
}

// Remove punctuation and formatting from text, keeping only letters, numbers, and spaces
const removePunctuationAndFormatting = (text) => {
    if (!text) return ''

    let normalizedText = text
        // Convert underscores to spaces
        .replace(/_/g, ' ')
        // Remove all punctuation and special characters, keep only letters, numbers, spaces
        .replace(/[^\w\s]/g, ' ')
        // Replace multiple spaces with single space
        .replace(/\s+/g, ' ')
        .trim()

    return normalizedText
}

// Removes stop words from the text
const removeStopWords = (text) => {
    const stopWords = [
        "a", "an", "the",           // articles
        "and", "or", "but", "nor",  // conjunctions
        "in", "on", "at", "to",     // prepositions
        "of", "for", "by", "with",  // more prepositions
        "is", "are", "was", "were", // basic "be" verbs
        "this", "that", "it", "its" // demonstratives
    ]

    // Split text into words, filter out stop words, then rejoin
    return text
        .trim()
        .split(/\s+/)
        .filter((word) => !stopWords.includes(word))
        .join(' ')
}

// Removes duplicate words from the text while preserving order
const removeDuplicateWords = (text) => {
    const words = text.trim().split(/\s+/)
    const uniqueWordsSet = new Set()
    const uniqueWords = []

    for (const word of words) {
        if (!uniqueWordsSet.has(word)) {
            uniqueWordsSet.add(word)
            uniqueWords.push(word)
        }
    }

    return uniqueWords.join(' ')
}

// Lowercase and clean text by removing punctuations, stop words, and duplicates
export const normalizeText = (text) => {
    if (!text) return ''

    let normalizedText = text.toLowerCase()
    normalizedText = removePunctuationAndFormatting(normalizedText)
    normalizedText = removeStopWords(removeDuplicateWords(normalizedText))

    return normalizedText
}

// Helper function to search videos based on name tokens
export const searchVideos = ({ videos, searchQuery }) => {
    // Normalize and split search query into individual words (tokens)
    const normalizedSearchQuery = normalizeText(searchQuery)
    const searchTokens = normalizedSearchQuery.split(/\s+/).filter((token) => token.length > 0)

    // Filter videos that match any search token in the name
    const searchResults = Object.fromEntries(
        Object.entries(videos).filter(([, video]) => {
            const normalizedName = normalizeText(video.name)

            // Check if at least one token matches the name
            return searchTokens.some((token) => normalizedName.includes(token))
        })
    )

    return searchResults
}