import './App.css'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Home from './Pages/Home'

const App = () => {
  // State for sidebar expansion (expanded/collapsed)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  // State for imported videos, stored as an object for O(1) access
  const [videos, setVideos] = useState({})

  // Toggle sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  // Helper function to remove file extension from filename
  const removeFileExtension = (fileName) => {
    return fileName.replace(/\.[^/.]+$/, "")
  }

  // Helper function to extract unique video ID from blob URL
  const extractVideoId = (videoUrl) => {
    return videoUrl.split("/").pop()
  }

  // Handle video import from file input
  const handleImport = (files) => {
    if (files && files.length > 0) {
      const newVideosMap = {}

      Array.from(files).forEach((file) => {
        const videoUrl = URL.createObjectURL(file)
        const videoId = extractVideoId(videoUrl)
        // Store video details in object keyed by ID
        newVideosMap[videoId] = {
          id: videoId,
          name: removeFileExtension(file.name),
          url: videoUrl,
          type: file.type,
          size: file.size
        }
      })

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
        </Routes>
      </main>
    </>
  )
}

export default App