import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import more_options_icon from '../assets/icons/more-options-icon.png'

const Home = ({ videos }) => {
    const location = useLocation()

    // Filter and sort videos based on the current route
    const displayedVideos = useMemo(() => {
        if (!videos) return []

        // Convert videos object to array
        const videosArray = Object.values(videos)

        // For Home page, show random 12 videos
        if (location.pathname === '/') {
            const shuffled = [...videosArray]
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled.slice(0, 12)
        }
        // For Library page, show all videos
        else if (location.pathname === '/library') {
            return videosArray
        }

        return []
    }, [videos, location.pathname])

    // Helper function to format video duration
    const formatDuration = (seconds) => {
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

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {displayedVideos.map((video) => (
                    <div key={video.id} className="hover:bg-[#1e1e1e] rounded-lg cursor-pointer overflow-hidden transition-all hover:scale-105">
                        <div className="relative">
                            {/* Link to video watch page with preview card and duration overlay */}
                            <Link to={`/watch?v=${video.id}`}>
                                <video src={video.url} className="w-full aspect-video object-cover rounded-lg" controls={false} />
                                <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                    {formatDuration(video.duration)}
                                </span>
                            </Link>
                        </div>

                        <div className="py-1 ps-2 flex justify-between items-start gap-2">
                            <h3 className="text-sm font-medium leading-5 line-clamp-2">{video.name}</h3>

                            <button className="w-6 hover:bg-[#3c3c3c] rounded-full shrink-0 cursor-pointer">
                                <img src={more_options_icon} alt="" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home