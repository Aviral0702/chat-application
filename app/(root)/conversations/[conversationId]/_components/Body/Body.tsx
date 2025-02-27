import React from 'react'

type Props ={}

function Body(props: Props) {
    const {} = props

    return (
        <div className='flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar'>
            Chat Body
        </div>
    )
}

export default Body
