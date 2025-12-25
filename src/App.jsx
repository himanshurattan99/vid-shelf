import './App.css'
import { useState, useMemo, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Home from './Pages/Home'
import Video from './Pages/Video'
import Playlists from './Pages/Playlists'
import Playlist from './Pages/Playlist'
import Error from './Pages/Error'
import { shuffleArray, removeFileExtension, extractVideoId, getVideoDuration, generateThumbnail } from './utils'

const App = () => {
  // State for imported videos, stored as an object for O(1) access
  const [videos, setVideos] = useState({})
  // State for playlists
  const [playlists, setPlaylists] = useState({
    watch_later: { id: 'watch_later', name: 'Watch Later', videoIds: [] }
  })
  // State for sidebar expansion (expanded/collapsed)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  // State for sidebar mode ('contract' or 'slide')
  const [sidebarMode, setSidebarMode] = useState('contract')
  // State for global notifications
  const [notification, setNotification] = useState({ message: '', visible: false })

  // Memoize shuffled videos for Home page to persist order across navigation
  const homeVideos = useMemo(() => {
    return shuffleArray(Object.values(videos)).slice(0, 12)
  }, [videos])

  const location = useLocation()

  // Update sidebar mode based on route and screen size
  useEffect(() => {
    const updateSidebarMode = () => {
      const isMobile = window.innerWidth < 768
      const isVideoPage = location.pathname.startsWith('/watch')

      // Use slide mode (overlay) for mobile/video page, contract mode (static) otherwise
      setSidebarMode((isMobile || isVideoPage) ? 'slide' : 'contract')
    }

    // Run on mount and resize
    updateSidebarMode()

    window.addEventListener('resize', updateSidebarMode)
    return () => window.removeEventListener('resize', updateSidebarMode)
  }, [location.pathname])

  // Reset sidebar expansion state when switching modes
  useEffect(() => {
    setSidebarExpanded(sidebarMode === 'contract')
  }, [sidebarMode])

  // Ref to keep track of videos for cleanup
  const videosRef = useRef(videos)

  // Update ref whenever videos state changes
  useEffect(() => {
    videosRef.current = videos
  }, [videos])

  // Cleanup: Revoke all blob URLs ONLY when component unmounts
  useEffect(() => {
    return () => {
      Object.values(videosRef.current).forEach((video) => {
        if (video.url) {
          URL.revokeObjectURL(video.url)
        }
        if (video.thumbnail) {
          URL.revokeObjectURL(video.thumbnail)
        }
      })
    }
  }, [])

  // Toggle sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  // Helper function to show notification
  const showNotification = (message) => {
    setNotification({ message, visible: true })
    // Hide after 3 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  // Handle video import from file input
  const handleImport = async (files) => {
    if (files && files.length > 0) {
      const newVideosMap = {}

      for (const file of files) {
        const videoUrl = URL.createObjectURL(file)
        const videoId = extractVideoId(videoUrl)
        const duration = await getVideoDuration(videoUrl)
        const thumbnail = await generateThumbnail(videoUrl)

        // Store video details in object keyed by ID
        newVideosMap[videoId] = {
          id: videoId,
          name: removeFileExtension(file.name),
          url: videoUrl,
          type: file.type,
          size: file.size,
          duration: duration,
          thumbnail: thumbnail
        }
      }

      // Update videos state with new videos
      setVideos((prevVideos) => ({ ...prevVideos, ...newVideosMap }))

      const videoCount = files.length
      showNotification(`${videoCount} video${(videoCount !== 1) ? 's' : ''} imported successfully`)
    }
  }

  // Handle video removal
  const removeVideo = (videoId) => {
    setVideos((prevVideos) => {
      const updatedVideos = { ...prevVideos }
      const videoToRemove = updatedVideos[videoId]

      // Revoke blob URLs to prevent memory leaks
      if (videoToRemove) {
        if (videoToRemove.url) URL.revokeObjectURL(videoToRemove.url)
        if (videoToRemove.thumbnail) URL.revokeObjectURL(videoToRemove.thumbnail)
      }

      delete updatedVideos[videoId]
      return updatedVideos
    })

    showNotification('Video removed from library')
  }

  // Create a new playlist
  const createPlaylist = (name) => {
    // Generate ID from name: lowercase and replace spaces with underscores
    const id = name.toLowerCase().replace(/\s+/g, '_')

    // Check if playlist already exists
    if (playlists[id]) {
      showNotification(`Playlist '${name}' already exists`)
      return
    }

    // Add new playlist to state
    setPlaylists((prev) => ({
      ...prev,
      [id]: { id, name, videoIds: [] }
    }))

    showNotification(`Playlist '${name}' created`)
  }

  // Remove a playlist
  const removePlaylist = (playlistId) => {
    // Prevent deleting Watch Later playlist
    if (playlistId === 'watch_later') {
      showNotification("Cannot remove 'Watch Later' playlist")
      return
    }

    setPlaylists((prev) => {
      const updatedPlaylists = { ...prev }
      delete updatedPlaylists[playlistId]
      return updatedPlaylists
    })

    showNotification(`Playlist '${playlists[playlistId].name}' removed`)
  }

  // Add video to playlist
  const addVideoToPlaylist = (playlistId, videoId) => {
    setPlaylists((prevPlaylists) => {
      const playlist = prevPlaylists[playlistId]

      // Safety check: if playlist doesn't exist, return previous state
      if (!playlist) return prevPlaylists

      // Check for duplicates to prevent adding the same video twice
      if (playlist.videoIds.includes(videoId)) {
        showNotification(`Video already in ${playlist.name}!`)
        return prevPlaylists
      }

      showNotification(`Added to ${playlist.name}`)

      // Return new state with updated playlist
      return {
        ...prevPlaylists,
        [playlistId]: {
          ...playlist,
          videoIds: [...playlist.videoIds, videoId]
        }
      }
    })
  }

  // Remove video from playlist
  const removeVideoFromPlaylist = (playlistId, videoId) => {
    setPlaylists((prevPlaylists) => {
      const playlist = prevPlaylists[playlistId]

      // Safety check: if playlist doesn't exist, return previous state
      if (!playlist) return prevPlaylists

      showNotification(`Video removed from ${playlist.name}`)

      // Return new state with video removed
      return {
        ...prevPlaylists,
        [playlistId]: {
          ...playlist,
          videoIds: playlist.videoIds.filter((id) => id !== videoId)
        }
      }
    })
  }

  return (
    <>
      {/* Navbar with menu toggle and import functionality */}
      <Navbar onMenuClick={toggleSidebar} onImport={handleImport} />

      <main className="flex bg-[#181818] relative">
        {/* Sidebar navigation */}
        <Sidebar isExpanded={sidebarExpanded} mode={sidebarMode} />

        {/* Application Routes */}
        <Routes>
          <Route path='/' element={<Home videos={videos} homeVideos={homeVideos} removeVideo={removeVideo} playlists={playlists} addVideoToPlaylist={addVideoToPlaylist} />} />
          <Route path='/library' element={<Home videos={videos} removeVideo={removeVideo} playlists={playlists} addVideoToPlaylist={addVideoToPlaylist} />} />
          <Route path='/watch' element={<Video videos={videos} />} />
          <Route path='/playlists' element={<Playlists videos={videos} playlists={playlists} createPlaylist={createPlaylist} removePlaylist={removePlaylist} />} />
          <Route path='/playlist' element={<Playlist videos={videos} playlists={playlists} removeVideoFromPlaylist={removeVideoFromPlaylist} />} />
          <Route path='*' element={<Error errorCode='404' errorMessage="Hmm, this page doesn't exist. Looks like you took a wrong turn!" />} />
        </Routes>
      </main>

      {/* Global Notification Toast */}
      {(notification.visible) && (
        <div className="bg-[#333] py-2 px-3 rounded-lg text-slate-100 fixed bottom-1/20 left-1/2 -translate-x-1/2 z-10">
          {notification.message}
        </div>
      )}
    </>
  )
}

export default App