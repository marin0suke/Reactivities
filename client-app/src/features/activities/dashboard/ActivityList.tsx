import { Header } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import { Fragment } from "react";

// interface Props {       75. deleting activity using mobx
//     activities: Activity[];
//     // selectActivity: (id: string) => void;  73. no longer needed
//     deleteActivity: (id: string) => void;
//     submitting: boolean; // 65. deleting activity
// }

export default observer(function ActivityList() {
    const { activityStore } = useStore(); // 73. grab from activityStore. also change below in the method
    const { groupedActivities } = activityStore; // 76. updated (activities => activitiesByDate) - using computed property here now to sort activities by date

    // 92. some stuff removed as cut into new file ActivityListItem. just left what is needed here since it isn't in the other


    return (
        <>
            {groupedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {activities.map(activity => ( // 76. map obj. added sorting activities by date using computed property. updated code here to support (activities => activitiesByDate)
                        <ActivityListItem key={activity.id} activity={activity} />
                    ))}
                </Fragment>
            ))}
        </>

    )
})

// 93. grouping activities by date - lots of changes here, made new get function in activity store that will group the activities by date.
// and made necessary changes here to use that function, then display properly. 

//82. adding details link - changing link using react router - remove onClick event on button and add Link as and to attributes.
