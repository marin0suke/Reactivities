import { ErrorMessage, Form, Formik } from "formik"
import MyTextInput from "../../app/common/form/MyTextInput"
import { Button, Header, Label } from "semantic-ui-react"
import { useStore } from "../../app/stores/store"
import { observer } from "mobx-react-lite"

export default observer(function LoginForm() {
    const {userStore} = useStore();
    return (
        <Formik 
            initialValues={{email: "", password: "", error: null}}
            onSubmit={(values, {setErrors}) => userStore.login(values).catch(() => 
                setErrors({error: "Invalid email or password"}))}
        >
            {({handleSubmit, isSubmitting, errors}) => (
                <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                    <Header as="h2" content="Login to Reactivities" color="teal" textAlign="center" />
                    <MyTextInput placeholder="Email" name="email" />
                    <MyTextInput placeholder="Password" name="password" type="password" />
                    <ErrorMessage
                    name="error" render ={() => <Label style={{marginBottom: 10}} basic color="red" content={errors.error} /> }
                    />
                    <Button loading={isSubmitting} positive content="Login" type="submit" fluid />
                </Form>
            )}

        </Formik>
    )
})

//144. creating a login form - new file. 
//146. adding userStore before return statement. make LoginForm an observer.
//147. displaying errors in the form - can utilise Formik features by putting values (in onSubmit) inside brackets then adding setErrors.
// 152. adding modals - adding a header to the login form (now a modal).