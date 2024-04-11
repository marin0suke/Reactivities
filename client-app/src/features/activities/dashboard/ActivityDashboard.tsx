import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

// interface Props {     75. 
//     activities: Activity[];
//     // selectedActivity: Activity | undefined;    73. - no longer needed after adding mobx functions for selecting activity.
//     // selectActivity: (id: string) => void;        - selected, select, cancelselect, edit, open, close.
//     // cancelSelectActivity: () => void;            - also removed from app parameters below.
//     // editMode: boolean;
//     // openForm: (id: string) => void; // this id won't be optional, because if we are here at this stage, there will be something selected to pass down.
//     // closeForm: () => void;
//     // createOrEdit: (activity: Activity) => void;
//     deleteActivity: (id: string) => void;
//     submitting: boolean;
// }

export default observer(function ActivityDashboard() {
    
    const {activityStore} = useStore(); 
    const {selectedActivity, editMode} = activityStore;


    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList 
                // activities={activities}    75. deleting with mobx - no longer need any of this
                // // selectActivity={selectActivity}  - 73. no longer needed after mobx select functions
                // deleteActivity={deleteActivity}
                // submitting={submitting}
                />  
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode &&
                <ActivityDetails 
                // activity={selectedActivity}   73. 
                // cancelSelectActivity={cancelSelectActivity}  - 73. no longer needed
                // openForm={openForm}

                />}
                {editMode &&
                <ActivityForm 
                    // closeForm={closeForm}   73. no longer needed
                    // activity={selectedActivity}   73.
                    // createOrEdit={createOrEdit} 
                    // submitting={submitting}
                />}
            </Grid.Column>
        </Grid>
    )

})