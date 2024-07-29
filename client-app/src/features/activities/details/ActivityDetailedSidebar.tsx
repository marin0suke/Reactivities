import { Segment, List, Label, Item, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Activity } from '../../../app/models/activity';

interface Props {
    activity: Activity; // 172. replaced attendees prop with activity prop. 
}

export default observer(function ActivityDetailedSidebar ({activity: {attendees, host}}: Props) {
    if (!attendees) return null; // 172. temp for now. 
    return (
        <>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {attendees.length} {attendees.length === 1 ? "Person" : "People"} going 
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {attendees.map(attendee => (
                         <Item style={{ position: 'relative' }} key={attendee.username}>
                            {attendee.username === host?.username && // 172. added conditional
                                <Label
                                    style={{ position: 'absolute' }}
                                    color='orange'
                                    ribbon='right'
                                >
                                    Host
                                </Label>}

                         <Image size='tiny' src={attendee.image || '/assets/user.png'} />
                         <Item.Content verticalAlign='middle'>
                             <Item.Header as='h3'>
                                 <Link to={`/profiles/${attendee.username}`}>{attendee.displayName}</Link>
                             </Item.Header>
                             {attendee.following &&
                             <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>}
                         </Item.Content>
                     </Item>
                    ))}
                </List>
            </Segment>
        </>

    )
})


// 171. updating the details component - adding {attendees.length} {attendees.length === 1 ? "Person" : "People"} going - after the first segment.
// loop over attendees array: attendee.map in the next segment (list), ignore host info for now. 

// 229. added attendee.following && conditional to Item.Extra with following badge.