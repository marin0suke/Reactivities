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
    const {selectedActivity: activity, loadActivity, loadingInitial, clearSelectedActivity} = activityStore; // 73.  83. removed cancelSelected and openForm (deleted functions since grabbing individual using react router)
    const {id} = useParams();

    useEffect(() => {
        if (id) loadActivity(id);
        return () => clearSelectedActivity(); // adding this to clean up after ourselves. previous act won't be in memory. this also needs to be added in the dependencies.
    }, [id, loadActivity, clearSelectedActivity])

    // 84. using route parameters - added state to observe inside activityStore 

    if (loadingInitial || !activity) return <LoadingComponent />; // 73.  84. added loadingInital || - temp solution. when routed to activity view page, can't refresh. this is quick fix


    return (
       <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat activityId={activity.id}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar activity={activity}/>
            </Grid.Column>
       </Grid>
    )
})

// 83. also removed onClick from both buttons - will be replaced with something else
// 85. added Links from react router to both buttons, first one taking the id of activity
// 95. deleted the card component and replaced with Grid and the new components.
// 170. updating details view component - adding attendees props to activityDetailedSidebar. 
// 172. conditional rendering of buttons - changed prop passed to ActivityDetailedSidebar to activity instead of attendees.
// 216. after adding comments to client in activitydetailedchat, added activityid prop.