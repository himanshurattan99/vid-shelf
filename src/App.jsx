import './App.css'
import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Home from './Pages/Home'
import Video from './Pages/Video'
import { removeFileExtension, extractVideoId, getVideoDuration } from './utils'

const App = () => {
  // State for imported videos, stored as an object for O(1) access
  const [videos, setVideos] = useState({})
  // State for sidebar expansion (expanded/collapsed)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

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

        // Store video details in object keyed by ID
        newVideosMap[videoId] = {
          id: videoId,
          name: removeFileExtension(file.name),
          url: videoUrl,
          type: file.type,
          size: file.size,
          duration: duration
        }
      }

      // Update videos state with new videos
      setVideos((prevVideos) => ({ ...prevVideos, ...newVideosMap }))
    }
  }

  return (
    <>
      {/* Navbar with menu toggle and import functionality */}
      <Navbar onMenuClick={toggleSidebar} onImport={handleImport} />

      <main className="flex bg-[#181818] relative">
        {/* Sidebar navigation */}
        <Sidebar isExpanded={sidebarExpanded} />

        {/* Application Routes */}
        <Routes>
          <Route path='/' element={<Home videos={videos} />} />
          <Route path='/library' element={<Home videos={videos} />} />
          <Route path='/watch' element={<Video videos={videos} />} />
        </Routes>
      </main>
    </>
  )
}

export default App