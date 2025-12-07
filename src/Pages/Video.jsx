import { useSearchParams } from 'react-router-dom'
import VideoPlayer from '../Components/VideoPlayer'
import Error from './Error'

const Video = ({ videos }) => {
    // Extract video ID from URL query parameters
    const [searchParams] = useSearchParams()
    const videoId = searchParams.get('v')

    // Retrieve video object from videos map using videoId
    const video = videos[videoId]

    // Show Error page when video ID parameter is missing
    if (!videoId) {
        return (
            <Error errorCode='400' errorMessage='Hey! Tell us which video you want to watch!' />
        )
    }
    // Show Error page when video doesn't exist or is not found
    if (!video) {
        return (
            <Error errorCode='400' errorMessage="Oops! This video doesn't exist or went missing!" />
        )
    }

    return (
        <div className="h-[92.5vh] p-3 lg:py-6 lg:pr-6 lg:pl-24 bg-[#181818] text-slate-100 flex-1 flex flex-col lg:flex-row lg:justify-between gap-5 lg:gap-0 overflow-y-auto">
            {/* Main video content container */}
            <div className="lg:w-[64%] flex flex-col gap-2 sm:gap-3">
                <div className="-mx-3 lg:mx-0 aspect-video relative">
                    <VideoPlayer video={video} />
                </div>

                {/* Video title */}
                <h2 className="text-lg sm:text-xl font-medium">{video?.name}</h2>
            </div>
        </div >
    )
}

export default Video