
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';

function App() {
  const location = useLocation(); // 88. this will give us the URL - where the user has gone to
  // 88. if its 'nothing' just a /, then we can display the homepage. if not (they've navd somewhere else) then we can display below - inside return statement.

  // 73. Selecting an activity - new functions created in activityStore so these can be deleted. (next 4 functions). NOTE - the components were also deleted from the return block 
  // 74. creating activity in mobx - no longer need this function - added functions in activity store
  // 64. post data to server - if else added in place of ternary exp below - added functionality to agent.tsx

  return (
    <>
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            <Outlet />
          </Container>
        </>
      )}


    </>
  )
}

export default observer(App); // mobX actions - making the App component an observer
