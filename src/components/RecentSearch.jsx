import { useState } from "react"

function RecentSearch({
    recentHistory,
    setRecentHistory,
    setSelectedHistory,
    showHistory,
    setShowHistory,
    darkMode,
    setDarkMode
}) {

    const clearHistory = () => {
        localStorage.clear()
        setRecentHistory([])
    }

    const [showModeOptions, setShowModeOptions] = useState(false)

    return (
        <>
            <div className={`
                col-span-1
                dark:bg-zinc-800 bg-red-100
                pt-3
                w-64
                h-screen
                overflow-visible

                fixed top-0 left-0 z-40
                ${showHistory ? 'flex' : 'hidden'}

                md:static
                md:flex
                md:w-full
                md:h-screen
                md:col-span-1

                flex-col
            `}>

                {/* Recent Search */}
                <h1 className='text-xl dark:text-white text-zinc-800 flex text-center justify-center shrink-0'>
                    <span>Recent Search</span>

                    <button
                        onClick={clearHistory}
                        className='cursor-pointer ml-2'
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#e3e3e3"
                        >
                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                        </svg>
                    </button>
                </h1>


                {/* Recent History */}
                <ul className='text-left overflow-y-auto overflow-x-hidden mt-2 flex-1 min-h-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]'>
                    {
                        recentHistory &&
                        recentHistory.map((item, index) => (
                            <li
                                onClick={() => {
                                    setSelectedHistory(item)
                                    setShowHistory(false)
                                }}
                                key={index}
                                className='pl-3 px-5 truncate dark:text-zinc-400 text-zinc-700 cursor-pointer dark:hover:bg-zinc-700 dark:hover:text-zinc-200 hover:bg-red-200 hover:text-zinc-800'
                            >
                                {item}
                            </li>
                        ))
                    }
                </ul>


                {/* Dark / Light */}
                <div className="shrink-0 p-3 relative z-50">

                    {/* Desktop / Laptop */}
                    <select
                        value={darkMode}
                        onChange={(event) => setDarkMode(event.target.value)}
                        className='hidden md:block w-full p-2 rounded dark:bg-zinc-700 bg-white dark:text-white text-zinc-800 outline-none'
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>


                    {/* Mobile */}
                    <div className="md:hidden relative">

                        <button
                            onClick={() => setShowModeOptions(!showModeOptions)}
                            className='w-full p-2 rounded dark:bg-zinc-700 bg-white dark:text-white text-zinc-800 flex justify-between items-center'
                        >
                            <span>
                                {darkMode === 'dark' ? 'Dark' : 'Light'}
                            </span>

                            <span>
                                {showModeOptions ? '▲' : '▼'}
                            </span>
                        </button>


                        {
                            showModeOptions && (
                                <div className='absolute bottom-full left-0 w-full mb-1 rounded bg-white dark:bg-zinc-700 shadow-lg overflow-hidden'>

                                    <button
                                        onClick={() => {
                                            setDarkMode('dark')
                                            setShowModeOptions(false)
                                        }}
                                        className='w-full text-left p-2 dark:text-white text-zinc-800 dark:hover:bg-zinc-600 hover:bg-zinc-200'
                                    >
                                        Dark
                                    </button>

                                    <button
                                        onClick={() => {
                                            setDarkMode('light')
                                            setShowModeOptions(false)
                                        }}
                                        className='w-full text-left p-2 dark:text-white text-zinc-800 dark:hover:bg-zinc-600 hover:bg-zinc-200'
                                    >
                                        Light
                                    </button>

                                </div>
                            )
                        }

                    </div>

                </div>

            </div>
        </>
    )
}

export default RecentSearch