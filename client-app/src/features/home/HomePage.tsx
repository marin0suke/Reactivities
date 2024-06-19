import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

// 80 adding routes

export default observer(function HomePage() {
    const {userStore, modalStore} = useStore();
    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as="h1" inverted>
                    <Image size="massive" src='/assets/logo.png' alt='logo' style={{marginBotton: 12}} />
                    Reactivities
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' inverted content='Welcome to Reactivities' />
                        <Button as={Link} to="/activities" size="huge" inverted>
                            Go to Activities!
                        </Button>
                    </>

                ) : (
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size="huge" inverted>
                            Login!
                        </Button>
                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} size="huge" inverted>
                            Register
                        </Button>
                    </>
                )}                                
            </Container>
        </Segment>
    )
})

// 98. styling the home page
// 149. add functionality that shows whether we are currently logged in or not. Logged in status available in userStore. access userStore through userStore, make the function an observer.
// added new fragment (semantic ui) and have now added button to go to activities or to login.

// 152. adding modals. replaced the routing on button in ternary to login - to an onClick event to open modal. 
// also adding a button to register also we don't have the form for it yet.
