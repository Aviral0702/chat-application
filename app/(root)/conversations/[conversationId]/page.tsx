import ConversationContainer from '@/components/shared/conversation/ConversationContainer';
import React from 'react'

type Props = {
    params: {
        conversationId: string;
    }
}
async function Page({params}: Props) {
    const {conversationId} = params;
    
    return (
        <ConversationContainer>ConversationPage {conversationId}</ConversationContainer>
    )
}

export default Page
