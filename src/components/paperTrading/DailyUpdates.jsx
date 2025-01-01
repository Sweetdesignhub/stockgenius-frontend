import React from 'react'

function DailyUpdates() {
  return (
    <div className='flex flex-col gap-4'>
        <div className='news-table rounded-lg p-2'>Top Pick for Today</div>
        <div className='news-table rounded-lg p-2'>High Sentiment Stock</div>
        <div className='table-main rounded-lg p-2'>Low Risk Option</div>
        <div className='table-main rounded-lg p-2'>News and Events </div>
    </div>
  )
}

export default DailyUpdates