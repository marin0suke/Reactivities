import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";

export default observer(function ActivityDashboard() {
    
    const {activityStore} = useStore(); 
    const {loadActivities, activityRegistry} = activityStore;

    useEffect(() => { //71. refactoring - commented out entire code
        if (activityRegistry.size <= 1) loadActivities(); // 89. adding checking to see if we already have activities inside the store
    }, [loadActivities, activityRegistry.size])
  
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' /> // 63. adding loading indicators
  

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />  
            </Grid.Column>
            <Grid.Column width='6'>
               <ActivityFilters />
            </Grid.Column>
        </Grid>
    )

})

// 84. activity details and activity form are being routed to now so can remove them as components