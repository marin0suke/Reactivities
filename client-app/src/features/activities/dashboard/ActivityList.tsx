import { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

// interface Props {       75. deleting activity using mobx
//     activities: Activity[];
//     // selectActivity: (id: string) => void;  73. no longer needed
//     deleteActivity: (id: string) => void;
//     submitting: boolean; // 65. deleting activity
// }

export default observer(function ActivityList() {
    const {activityStore} = useStore(); // 73. grab from activityStore. also change below in the method
    const {deleteActivity, activitiesByDate, loading} = activityStore; // 76. updated (activities => activitiesByDate) - using computed property here now to sort activities by date
    const [target, setTarget] = useState('');

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }


    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(activity => ( // 76. map obj. added sorting activities by date using computed property. updated code here to support (activities => activitiesByDate)
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => activityStore.selectActivity(activity.id)} floated='right' content='View' color='blue' />
                                <Button 
                                    name={activity.id}
                                    loading={loading && target === activity.id} 
                                    onClick={(e) => handleActivityDelete(e, activity.id)} 
                                    floated='right' 
                                    content='Delete' 
                                    color='red' 
                                /> 
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})