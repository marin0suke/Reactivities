import { observer } from "mobx-react-lite";
import { Image, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
    attendees: Profile[];
}


export default observer(function ActivityListItemAttendee({attendees}: Props) {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                            <Image size="mini" circular src={attendee.image || "/assets/user.png"} />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>
                
            ))}
        </List>
    )
})

// 170. adding the attendees component. 
// observer MobX - although we won't directly access anything from the store, we do want this to observe the activitystore itself - 
// bc this comp will receive props from a parent comp that will be getting attendees from the store. 

// 170. added Profile props to get info we need to show attendee info. 
// 175. adding popup card for attendees - added Popup from semantic, put ListItem as trigger. added the ProfileCard we created as the popup content. added attendee as prop within this comp. 