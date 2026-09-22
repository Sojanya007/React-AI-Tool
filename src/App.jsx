import { useEffect, useState, useRef } from 'react'
import './App.css'
import { URL } from './constants'
import RecentSearch from './components/RecentSearch'
import QuestionAnswer from './components/QuestionAnswer'


function App() {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState([])
  const [recentHistory, setRecentHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('history')) || []
    }
    catch {
      return []
    }
  })
  const [selectedHistory, setSelectedHistory] = useState('')
  const scrollToAns = useRef()
  const [loader, setLoader] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const askGemini = async (payload) => {

    const maxRetries = 3

    for (let attempt = 0; attempt <= maxRetries; attempt++) {

      console.log(`Gemini request attempt ${attempt + 1}`)

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      console.log("Gemini response:", data)

      if (response.ok) {
        return data
      }

      if (response.status === 503 && attempt < maxRetries) {

        const delay = 2000 * Math.pow(2, attempt)

        console.log(
          `Gemini is busy. Retrying in ${delay / 1000} seconds...`
        )

        await wait(delay)

        continue
      }

      throw new Error(
        data?.error?.message ||
        `Gemini API error: ${response.status}`
      )
    }
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onload = () => {
        resolve(reader.result.split(',')[1])
      }

      reader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const askQuestion = async () => {

    if (!question && !selectedHistory) {
      return false
    }

    if (question) {
      let history = []

      try {
        history = JSON.parse(localStorage.getItem('history')) || []
      }
      catch {
        history = []
      }

      history = [question, ...history]

      localStorage.setItem('history', JSON.stringify(history))

      setRecentHistory(history)
    }

    const payloadData = question ? question : selectedHistory

    let parts = [
      {
        text: payloadData
      }
    ]

    if (selectedFile) {
      const base64Data = await fileToBase64(selectedFile)

      parts.push({
        inline_data: {
          mime_type: selectedFile.type,
          data: base64Data
        }
      })
    }

    const payload = {
      contents: [
        {
          parts: parts
        }
      ]
    }

    setLoader(true)

    try {

      let data = await askGemini(payload)

      console.log(
        "Full Gemini Response:",
        JSON.stringify(data, null, 2)
      )

      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log("Unexpected Gemini response:", data)
        alert("Gemini returned an unexpected response.")
        return
      }

      let dataString = data.candidates[0].content.parts[0].text

      dataString = dataString.split("* ")
      dataString = dataString.map((item) => item.trim())

      setResult([
        ...result,
        {
          type: 'q',
          text: question ? question : selectedHistory
        },
        {
          type: 'a',
          text: dataString
        }
      ])

      setQuestion('')
      setSelectedFile(null)
      setPreview(null)

      setTimeout(() => {
        if (scrollToAns.current) {
          scrollToAns.current.scrollTop =
            scrollToAns.current.scrollHeight
        }
      }, 500)

    }
    catch (error) {

      console.log("Fetch Error:", error)
      console.log("Error message:", error.message)

      alert(
        error.message ||
        "Something went wrong while connecting to Gemini."
      )

    }
    finally {
      setLoader(false)
    }
  }

  //console.log(recentHistory);



  const isEnter = (event) => {
    if (event.key === 'Enter') {
      askQuestion()
    }
  }
  useEffect(() => {
    console.log(selectedHistory);
    askQuestion()

  }, [selectedHistory])

  // dark mode
  const [darkMode, setDarkMode] = useState('dark')
  useEffect(() => {
    console.log(darkMode);
    if (darkMode == 'dark') {
      document.documentElement.classList.add('dark')
    }
    else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  //

  return (
    <div className={darkMode == 'dark' ? 'dark' : 'light'}>
      <div className='grid grid-cols-1 md:grid-cols-5 h-screen text-center'>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className='md:hidden fixed top-3 left-3 z-50 text-2xl dark:text-white text-zinc-800'
        >
          ⋮
        </button>



        <RecentSearch recentHistory={recentHistory} setRecentHistory={setRecentHistory} setSelectedHistory={setSelectedHistory} showHistory={showHistory} setShowHistory={setShowHistory} darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className='col-span-1 md:col-span-4 p-4 sm:p-6 md:p-9 min-w-0 h-[calc(100vh-8rem)] md:h-screen flex flex-col overflow-hidden'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl pb-2 bg-clip-text text-transparent bg-linear-to-r from-red-700 to-violet-700 '>
            Hello User, Ask me Anything</h1>
          {
            loader ?
              <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 mt-5 text-gray-300 animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div> : null
          }

          <div ref={scrollToAns} className='w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden mt-5'>
            <div className='dark:text-zinc-300 text-zinc-800 mt-8'>
              <ul>
                {
                  result.map((item, index) => (
                    <QuestionAnswer key={index} item={item} index={index} />
                  ))
                }
              </ul>
            </div>
          </div>


          <div className='fixed bottom-13 left-3 right-3 z-30 md:static md:w-3/5 md:max-w-150 md:mx-auto md:mt-4'>

            {/* Selected image preview */}
            {selectedFile && preview && (
              <div className='mb-2 p-2 rounded-xl border border-zinc-700 bg-white dark:bg-zinc-800 w-fit'>

                <div className='relative'>

                  <img
                    src={preview}
                    alt='Selected'
                    className='w-20 h-20 object-cover rounded-lg'
                  />

                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      setPreview(null)
                    }}
                    className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-sm'
                  >
                    ×
                  </button>

                </div>

              </div>
            )}

            {/* Ask box */}
            <div className='dark:bg-zinc-800 bg-red-100 p-1 pr-3 dark:text-white text-zinc-800 rounded-4xl border border-zinc-700 flex h-14 sm:h-16'>

              <input
                type='file'
                hidden
                id='fileInput'
                accept='image/*'
                onChange={(event) => {
                  const file = event.target.files[0]

                  if (file) {
                    setSelectedFile(file)
                    setPreview(window.URL.createObjectURL(file))
                  }
                }}
              />

              <label
                htmlFor='fileInput'
                className='flex items-center justify-center px-3 text-2xl cursor-pointer'
              >
                +
              </label>

              <input
                type="text"
                value={question}
                onKeyDown={isEnter}
                onChange={(event) => setQuestion(event.target.value)}
                className='w-full h-full p-3 outline-none'
                placeholder='Ask me anything'
              />

              <button onClick={askQuestion}>
                Ask
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default App


