
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';

function App() {
  const location = useLocation(); // 88. this will give us the URL - where the user has gone to
  // 88. if its 'nothing' just a /, then we can display the homepage. if not (they've navd somewhere else) then we can display below - inside return statement.

  const {commonStore, userStore} = useStore(); // 150. persisting the login. added common and user stores.

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded())
    } else {
      commonStore.setAppLoaded()
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' /> // 150. add loading spinner if we are loading.

  // 73. Selecting an activity - new functions created in activityStore so these can be deleted. (next 4 functions). NOTE - the components were also deleted from the return block 
  // 74. creating activity in mobx - no longer need this function - added functions in activity store
  // 64. post data to server - if else added in place of ternary exp below - added functionality to agent.tsx

  return (
    <>
    <ModalContainer />
    <ToastContainer position='bottom-right' hideProgressBar theme='colored' /> 
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
// 108. prepping error handling in client app - adding toast container at top of return statement. 

// 152. adding modals - added ModalContainer component just above ToastContainer
