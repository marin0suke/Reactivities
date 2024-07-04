import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
    activity: Activity
}

export default function ActivityListItem({ activity }: Props) {

    // const { activityStore } = useStore(); // 73. grab from activityStore. also change below in the method
    // const { deleteActivity, loading } = activityStore; // 76. updated (activities => activitiesByDate) - using computed property here now to sort activities by date
    //  const [target, setTarget] = useState('');
    // 98. cleaning up unused vars etc.


    return (
        <Segment.Group>
            <Segment>
                {activity.isCancelled && // 175. adding a cancel activity method.
                    <Label attached="top" color="red" content="Cancelled" style={{textAlign: "center"}} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 5}} size='tiny' circular src={activity.host?.image || '/assets/user.png'} /> 
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted By <Link to={`/profiles/${activity.hostUsername}`}>{activity.host?.displayName}</Link></Item.Description> 
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color="orange">
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color="green">
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!, "dd MMM yyyy h:mm aa")}
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!}/> 
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button 
                    as={Link}
                    to={`/activities/${activity.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    )
}

// 92. styling activity list - created this file and cut some/copied some from activity list
// 94. cut from ActivityList so we have something, but need to recode the entire thing - 
// going from what we have now to segment with icons etc on each card for each activity

//124. date-fns formatting date so it displays as a string

// 170. adding the attendees component - created and added new component to show attendees (ActivityListItemAttendee)
// 172. adding expression inside hosted by element - to pull in host displayname. 
// also added conditionals for isGoing and isHost. 
// 175. added a marginBottom of 5 to the Item.Image so the bottom wasn't cut off. 

// 192. added activity.host?.image to the Item.Image for this component (list item for each activity in the activities page).