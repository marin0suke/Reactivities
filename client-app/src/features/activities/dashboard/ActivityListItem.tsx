import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";

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
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted By Bob</Item.Description>
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
                Attendees go here
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