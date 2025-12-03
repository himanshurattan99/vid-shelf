const VideoPlayer = ({ video }) => {
    return (
        <video src={video.url} className="w-full aspect-video rounded-lg" controls />
    )
}

export default VideoPlayer