import { useNavigate, useSearchParams } from 'react-router-dom'
import Error from './Error.jsx'
import { searchVideos, formatDuration } from '../utils.js'

const Search = ({ videos, sidebarExpanded = true }) => {
    const navigate = useNavigate()

    // Extract search query from URL query parameters
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('q')

    // Show Error page when search query parameter is missing
    if (!(searchQuery)) {
        return (
            <Error errorCode='400' errorMessage='Hey! You forgot to tell us what to search for!' />
        )
    }

    // Filter videos based on search query
    const searchResults = Object.values(searchVideos({ videos, searchQuery }))

    // Show empty state message if there are no search results
    if (searchResults.length === 0) {
        return (
            <div className="h-[92.5vh] p-3 lg:p-6 flex-1">
                <div className="text-sm text-slate-300">
                    No results found for "{searchQuery}"
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="h-[92.5vh] text-slate-100 overflow-y-auto">
                <div className="p-3 lg:p-6 flex flex-col gap-4">
                    {searchResults.map((video) => {
                        return (
                            <div key={video.id} onClick={() => navigate(`/watch?v=${video.id}`)} className="p-2 hover:bg-[#1e1e1e] rounded-lg flex flex-col sm:flex-row gap-2 sm:gap-3 cursor-pointer">
                                {/* Video thumbnail with duration overlay */}
                                <div className={`${(sidebarExpanded) ? 'md:w-1/2' : 'md:w-2/5'} lg:w-1/3 aspect-video shrink-0 relative`}>
                                    <img src={video.thumbnail} className="w-full object-cover rounded-lg" alt="" />
                                    <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                        {formatDuration(video.duration)}
                                    </span>
                                </div>

                                {/* Video name */}
                                <div className="flex-1 flex items-center">
                                    <h3 className="text-lg line-clamp-2">{video.name}</h3>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Search