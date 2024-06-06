import { Button, Container, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

// interface Props {            73. - App comp being cleaned up so this is not needed anymore.
//     openForm: () => void;            props in NavBar also deleted.
// }

// 81. adding navlink using react router. inside Menu.Item as Navlink with as and to attributes
// also turned button into a navlink - removed onclick event and added 

export default function NavBar() {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header> 
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name="Activities"/>
                <Menu.Item as={NavLink} to='/errors' name="Errors"/> 
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content="Create Activity" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}

// 108. prep for setting up error handling in client app (added navlink to errors)