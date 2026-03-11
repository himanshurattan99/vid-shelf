import { useId } from 'react'

const VidShelfIcon = ({ className = 'h-5 w-auto shrink-0' }) => {
    const gradientId = useId()
    const glossId = useId()

    return (
        <svg viewBox="0 0 232 180" className={className} role="img" aria-label="VidShelf Icon">
            <defs>
                <linearGradient id={gradientId} x1="6%" y1="4%" x2="94%" y2="96%">
                    <stop offset="0%" stopColor="#41B0FF" />
                    <stop offset="48%" stopColor="#1F93FF" />
                    <stop offset="100%" stopColor="#0073EE" />
                </linearGradient>
                <linearGradient id={glossId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
            </defs>

            <rect x="0" y="0" width="232" height="180" rx="40" fill={`url(#${gradientId})`} />
            <rect x="0" y="0" width="232" height="84" rx="40" fill={`url(#${glossId})`} />
            <path d="M92 58c0-7 7-11 13-8l52 32c6 4 6 12 0 16l-52 32c-6 3-13-1-13-8V58z" fill="#0B1220" />
        </svg>
    )
}

export default VidShelfIcon