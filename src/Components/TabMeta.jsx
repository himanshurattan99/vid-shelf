import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const routeTitles = {
    '/': 'VidShelf',
    '/library': 'Library',
    '/history': 'History',
    '/playlists': 'Playlists',
    '/settings': 'Settings'
}

// Derive the browser tab title from the current route and query params
const getPageTitle = ({ pathname, search, videos, playlists }) => {
    const searchParams = new URLSearchParams(search)
    const fallbackTitle = routeTitles[pathname] || 'VidShelf'

    if (pathname === '/watch') {
        const videoId = searchParams.get('v')
        const videoName = (videoId) ? videos?.[videoId]?.name : null
        return videoName || 'Watch'
    }

    if (pathname === '/playlist') {
        const playlistId = searchParams.get('p')
        const playlistName = (playlistId) ? playlists?.[playlistId]?.name : null
        return playlistName || 'Playlist'
    }

    if (pathname === '/search') {
        const searchQuery = searchParams.get('q')?.trim()
        return searchQuery || 'Search'
    }

    return fallbackTitle
}

const TabMeta = ({ videos, playlists, iconHref = '/vidshelf-icon.svg' }) => {
    const location = useLocation()

    useEffect(() => {
        const pageTitle = getPageTitle({
            pathname: location.pathname,
            search: location.search,
            videos,
            playlists
        })
        document.title = pageTitle
    }, [location.pathname, location.search, playlists, videos])

    useEffect(() => {
        // Reuse the existing favicon link when present
        let iconLink = document.querySelector("link[rel='icon']")
        if (!iconLink) {
            iconLink = document.createElement('link')
            iconLink.setAttribute('rel', 'icon')
            iconLink.setAttribute('type', 'image/svg+xml')
            document.head.appendChild(iconLink)
        }

        iconLink.setAttribute('href', iconHref)
    }, [iconHref])

    return null
}

export default TabMeta