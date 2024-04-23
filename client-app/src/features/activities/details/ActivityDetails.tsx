import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

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
       <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>
       </Grid>
    )
})

// 83. also removed onClick from both buttons - will be replaced with something else
// 85. added Links from react router to both buttons, first one taking the id of activity
// 95. deleted the card component and replaced with Grid and the new components.
