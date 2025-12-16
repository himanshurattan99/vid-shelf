import { Link } from 'react-router-dom'

const Playlists = ({ videos, playlists }) => {
    // Convert playlists object to array
    const playlistsArray = Object.values(playlists)

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3">
                {playlistsArray.map((playlist) => {
                    // Get the first video to use as the playlist thumbnail
                    const firstVideoId = playlist.videoIds[0]
                    const firstVideo = videos[firstVideoId]

                    return (
                        <div key={playlist.id} className="p-2 hover:bg-[#1e1e1e] rounded-lg cursor-pointer transition-all hover:scale-105">
                            <div className="aspect-video relative">
                                {/* Link to playlist page */}
                                <Link to={`/playlist?p=${playlist.id}`}>
                                    {(firstVideo && firstVideo.thumbnail) ? (
                                        <img src={firstVideo.thumbnail} className="w-full object-cover rounded-lg" alt={firstVideo.name} />
                                    ) : (
                                        // Show placeholder if playlist is empty or first video has no thumbnail
                                        <div className="h-full bg-[#282828] rounded-lg text-sm flex justify-center items-center">No preview</div>
                                    )}
                                    <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                        {playlist.videoIds.length} videos
                                    </span>
                                </Link>
                            </div>

                            <div className="py-1 ps-2 flex justify-between items-start gap-2">
                                <h3 className="text-sm font-medium leading-5 line-clamp-2">{playlist.name}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Playlists