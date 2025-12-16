import './App.css'
import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Home from './Pages/Home'
import Video from './Pages/Video'
import Playlists from './Pages/Playlists'
import Playlist from './Pages/Playlist'
import Error from './Pages/Error'
import { removeFileExtension, extractVideoId, getVideoDuration, generateThumbnail } from './utils'

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
  }

  // Add video to playlist
  const addVideoToPlaylist = (playlistId, videoId) => {
    setPlaylists((prevPlaylists) => {
      const playlist = prevPlaylists[playlistId]

      // Safety check: if playlist doesn't exist, return previous state
      if (!playlist) return prevPlaylists

      // Check for duplicates to prevent adding the same video twice
      if (playlist.videoIds.includes(videoId)) {
        return prevPlaylists
      }

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
          <Route path='/' element={<Home videos={videos} removeVideo={removeVideo} addVideoToPlaylist={addVideoToPlaylist} />} />
          <Route path='/library' element={<Home videos={videos} removeVideo={removeVideo} addVideoToPlaylist={addVideoToPlaylist} />} />
          <Route path='/watch' element={<Video videos={videos} />} />
          <Route path='/playlists' element={<Playlists videos={videos} playlists={playlists} />} />
          <Route path='/playlist' element={<Playlist videos={videos} playlists={playlists} removeVideoFromPlaylist={removeVideoFromPlaylist} />} />
          <Route path='*' element={<Error errorCode='404' errorMessage="Hmm, this page doesn't exist. Looks like you took a wrong turn!" />} />
        </Routes>
      </main>
    </>
  )
}

export default App