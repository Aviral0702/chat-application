import React from 'react'

type Props = {
    params: {
        conversationId: string;
    }
}
function Page({params}: Props) {
    const {conversationId} = params;
    
    return (
        <div>ConversationPage {conversationId}</div>
    )
}

export default Page
