import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";

// interface Props {     73. no longer need any of these props, remove from parameters below too.
//     activity: Activity
//     cancelSelectActivity: () => void;
//     openForm: (id: string) => void;
    
// }

export default function ActivityDetails() {

    const {activityStore} = useStore(); // 73. 
    const {selectedActivity: activity, openForm, cancelSelectedActivity} = activityStore; // 73. 

    if (!activity) return <LoadingComponent />; // 73. 

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <CardContent>
                <CardHeader>{activity.title}</CardHeader>
                <CardMeta>
                    <span>{activity.date}</span>
                </CardMeta>
                <CardDescription>
                    {activity.description}
                </CardDescription>
            </CardContent>
            <CardContent extra>
               <Button.Group widths='2'>
                <Button onClick={() => openForm(activity.id)} basic color='blue' content='Edit' />
                <Button onClick={cancelSelectedActivity} basic color='grey' content='Cancel' />
               </Button.Group>
            </CardContent>
        </Card>
    )
}