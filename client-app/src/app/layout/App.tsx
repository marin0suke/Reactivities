
import { useEffect } from 'react'
import { Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();

  // const [activities, setActivities] = useState<Activity[]>([]);
  // const [submitting, setSubmitting] = useState(false); //64. posting data to the server 

  useEffect(() => { //71. refactoring - commented out entire code
    activityStore.loadActivities();
    // axios.get<Activity[]>('http://localhost:5000/api/activities')  - old code. replaced in 61. setting up axios. got our agent.ts file set up, and now changing
    // agent.Activities.list().then(response => { //61. setting up agent.ts file allows requests to come in on a separate page. 
    //   const activities: Activity[] = []; //. 62 the date property inside the activity before we set our activities.
    //     response.forEach(activity => {
    //     activity.date = activity.date.split('T')[0]; // 62. [0] takes the first part of what is being split. indexing split by T.
    //     activities.push(activity);
    //   })
    //   setActivities(response); // 61. also took the .data off the end here. Hadn't done this and webpage was not loading. 63. in this vid this is set to activities not response - not sure which is supposed to be
    //   setLoading(false);
    // })
  }, [activityStore]);

  // 73. Selecting an activity - new functions created in activityStore so these can be deleted. (next 4 functions). NOTE - the components were also deleted from the return block 

  // function handleSelectActivity (id: string) { // 51. selecting an activity to view
  //   setSelectedActivity(activities.find(x => x.id === id));
  // }

  // function handleCancelSelectActivity() { // 51. selecting activity to view
  //   setSelectedActivity(undefined);
  // }

  // function handleFormOpen(id?: string) { // 54. displaying create/edit form. id with q mark makes it an optional arg.
  //   id ? handleSelectActivity(id) : handleCancelSelectActivity();
  //   setEditMode(true);
  // }

  // function handleFormClose() { // 54. displaying create/edit form
  //   setEditMode(false);
  // }

    // 74. creating activity in mobx - no longer need this function - added functions in activity store
  // function handleCreateOrEditActivity(activity: Activity) { // 56. handle, create and edit submission
  //   setSubmitting(true); // 64. post data to server - so we can start out loading indicators
  //   if (activity.id) {
  //     agent.Activities.update(activity).then(() => {
  //       setActivities([...activities.filter(x => x.id !== activity.id), activity]);
  //       setSelectedActivity(activity);
  //       setEditMode(false);
  //       setSubmitting(false);
  //     })
  //   } else {
  //       activity.id = uuid();
  //       agent.Activities.create(activity).then(() => {
  //         setActivities([...activities, activity]) // uuid set as id at top of else block, so this is replaced
  //         setSelectedActivity(activity);
  //         setEditMode(false);
  //         setSubmitting(false);
  //       })
  //   }
  // }  
  // 64. post data to server - if else added in place of ternary exp below - added functionality to agent.tsx

    // activity.id ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
    // : setActivities([...activities, {...activity, id: uuid()}]); // 57. generate unique ID - GUID (through package install) change just {activity} to {...activity, id: uuid()}. 
    // setEditMode(false);
    // setSelectedActivity(activity);
  

  // function handleDeleteActivity(id: string) {
  //   setSubmitting(true);
  //   agent.Activities.delete(id).then(() => {
  //     setActivities([...activities.filter(x => x.id !== id)]);
  //     setSubmitting(false);
  //   })
  // }

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' /> // 63. adding loading indicators

 return ( 
  <>
    <NavBar />
    <Container style={{marginTop: '7em'}}>
      <ActivityDashboard 
      // activities={activityStore.activities}
      // deleteActivity={handleDeleteActivity}
      // submitting={submitting}
      />
    </Container>
    
  </>   
  )
}

export default observer(App); // mobX actions - making the App component an observer
