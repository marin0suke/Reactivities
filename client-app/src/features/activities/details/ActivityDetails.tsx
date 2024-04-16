import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default observer(function ActivityDetails() {

    const {activityStore} = useStore(); // 73. 
    const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore; // 73.  83. removed cancelSelected and openForm (deleted functions since grabbing individual using react router)
    const {id} = useParams();

    useEffect(() => {
        if (id) loadActivity(id);
    }, [id, loadActivity])

    // 84. using route parameters - added state to observe inside activityStore 

    if (loadingInitial || !activity) return <LoadingComponent />; // 73.  84. added loadingInital || - temp solution. when routed to activity view page, can't refresh. this is quick fix


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
                <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content='Edit' />
                <Button as={Link} to='/activities' basic color='grey' content='Cancel' />
               </Button.Group>
            </CardContent>
        </Card>
    )
})

// 83. also removed onClick from both buttons - will be replaced with something else
// 85. added Links from react router to both buttons, first one taking the id of activity