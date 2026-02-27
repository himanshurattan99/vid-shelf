import { useNavigate, useSearchParams } from 'react-router-dom'
import Error from './Error.jsx'
import { searchVideos, formatDuration } from '../utils.js'

const Search = ({ videos }) => {
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
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <h2 className="mb-3 text-xl font-bold">
                Search Results for "{searchQuery}"
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {searchResults.map((video) => {
                    return (
                        <div key={video.id} className="hover:bg-[#212121] rounded-lg cursor-pointer transition-colors">
                            <div className="rounded-lg relative overflow-hidden">
                                {/* Video thumbnail card with duration overlay */}
                                <div onClick={() => navigate(`/watch?v=${video.id}`)}>
                                    <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt={video.name} />
                                    <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                        {formatDuration(video.duration)}
                                    </span>
                                    {/* Progress Bar Overlay */}
                                    {(video.progress > 0) && (
                                        <div className="h-1 bg-[#007fff] rounded-lg absolute bottom-0 left-0" style={{ width: `${(video.progress / video.duration) * 100}%` }}></div>
                                    )}
                                </div>
                            </div>

                            <div className="py-1 ps-2 flex justify-between items-start gap-2">
                                <h3 className="text-sm font-medium leading-5 line-clamp-2">{video.name}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Search