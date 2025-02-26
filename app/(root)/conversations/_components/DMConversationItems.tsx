import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Id } from '@/convex/_generated/dataModel';
import { Avatar } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

type Props = {
    id: Id<"conversations">;
    imageUrl: string;
    username: string;
}

function DMConversationItems(props: Props) {
    const {id,imageUrl,username} = props

    return (<Link href={`/conversations/${id}`} className='w-full'>
        <Card className='p-2 flex flex-row items-center gap-4 truncate'>
            <div className='flex flex-row items-center gap-4 truncate'>
                <Avatar className='h-10 w-10'>
                    <AvatarImage src={imageUrl}/>
                    <AvatarFallback>
                        <User/>
                    </AvatarFallback>
                </Avatar>
                <div className='flex flex-col truncate'>
                    <h4 className='truncate'>
                        {username}
                    </h4>
                    <p className='text-sm text-muted-foreground truncate'>Start the conversation</p>
                </div>
            </div>
        </Card>
    </Link>)
}

export default DMConversationItems
