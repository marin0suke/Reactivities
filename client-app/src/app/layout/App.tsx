
import { useEffect, useState } from 'react'
import axios from 'axios';
import { Container} from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid'; // error maybe JS available but not TS definition file. 

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false); // 54. displaying create/edit form
  

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
    .then(response => {
      setActivities(response.data)
    })
  }, [])

  function handleSelectActivity (id: string) { // 51. selecting an activity to view
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity() { // 51. selecting activity to view
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) { // 54. displaying create/edit form. id with q mark makes it an optional arg.
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() { // 54. displaying create/edit form
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) { // 56. handle, create and edit submission
    activity.id ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
    : setActivities([...activities, {...activity, id: uuid()}]); // 57. generate unique ID - GUID (through package install) change just {activity} to {...activity, id: uuid()}. 
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

 return ( 
  <>
    <NavBar openForm={handleFormOpen} />
    <Container style={{marginTop: '7em'}}>
      <ActivityDashboard 
      activities={activities} 
      selectedActivity={selectedActivity}
      selectActivity={handleSelectActivity}
      cancelSelectActivity={handleCancelSelectActivity}
      editMode={editMode}
      openForm={handleFormOpen}
      closeForm={handleFormClose}
      createOrEdit={handleCreateOrEditActivity} 
      deleteActivity={handleDeleteActivity}

      />
    </Container>
    
  </>   
  )
}

export default App
