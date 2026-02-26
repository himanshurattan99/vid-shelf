import { useNavigate } from 'react-router-dom'

const Error = ({ errorCode, errorMessage }) => {
    const navigate = useNavigate()

    return (
        <div className="h-[92.5vh] px-3 flex-1">
            <div className="mt-3 lg:mt-6 flex flex-col items-center gap-1 sm:gap-2 lg:-translate-x-27">
                {/* Error Code */}
                <div className="text-5xl text-red-500 font-medium">
                    {errorCode}
                </div>

                {/* Error Title */}
                <div className="text-2xl text-slate-100 font-medium text-center">
                    {errorMessage}
                </div>

                {/* Error Message */}
                <div className="sm:w-4/5 lg:w-1/2 bg-gradient-to-r from-slate-300 via-[#3c3c3c] to-[#2e2e2e] bg-clip-text text-transparent text-justify sm:text-center">
                    The page you're looking for seems to have vanished into the digital void.
                    Don't worry, it happens to the best of us!
                </div>
            </div>

            <div className='mt-6 flex justify-center lg:-translate-x-27'>
                <button onClick={() => navigate('/')} className="py-1 px-3 hover:bg-[#2d3d5a] border border-[#3d3d3d] hover:border-[#2d3d5a] rounded-3xl text-[#007fff] font-medium cursor-pointer">
                    Go to Home
                </button>
            </div>
        </div>
    )
}

export default Error