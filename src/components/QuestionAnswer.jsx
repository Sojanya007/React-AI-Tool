import Answer from './Answers'

const QuestionAnswer = ({ item, index }) => {
  return (
    <>
      <div key={index} className={item.type === 'q' ? 'flex justify-end w-full' : 'w-full'}>
        {
          item.type == 'q' ?
            <li
              key={index}
              className='text-right p-2 sm:p-3 bg-red-100 dark:bg-zinc-700 text-zinc-800 dark:text-white rounded-tl-3xl rounded-br-3xl rounded-bl-3xl max-w-[80%] wrap-break-word'
            >
              {item.text}
            </li>
            : item.text.map((ansItem, ansIndex) => (
              <li key={ansIndex} className='text-left p-1 max-w-full overflow-x-auto wrap-break-word'><Answer ans={ansItem} totalResult={item.text.length} type={item.type} index={ansIndex} /></li>
            ))
        }
      </div>
    </>
  )
}

export default QuestionAnswer

/*
<li key={index} className='inline-block text-right p-2 sm:p-3 bg-red-100 dark:bg-zinc-700 text-zinc-800 dark:text-white rounded-tl-3xl rounded-br-3xl rounded-bl-3xl max-w-[80%] wrap-break-word'>
                          <Answer ans={item.text} totalResult={1} index={index} type={item.type} /></li>
*/