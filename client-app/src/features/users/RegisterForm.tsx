import { ErrorMessage, Form, Formik } from "formik"
import MyTextInput from "../../app/common/form/MyTextInput"
import { Button, Header } from "semantic-ui-react"
import { useStore } from "../../app/stores/store"
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import ValidationError from "../errors/ValidationError"

export default observer(function LoginForm() {
    const {userStore} = useStore();
    return (
        <Formik 
            initialValues={{displayName: "", username: "", email: "", password: "", error: null}}
            onSubmit={(values, {setErrors}) => userStore.register(values).catch(error => 
                setErrors({error}))}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),
            })}
        >
            {({handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                    <Header as="h2" content="Sign up to Reactivities" color="teal" textAlign="center" />
                    <MyTextInput placeholder="Display Name" name="displayName" />
                    <MyTextInput placeholder="Username" name="username" />
                    <MyTextInput placeholder="Email" name="email" />
                    <MyTextInput placeholder="Password" name="password" type="password" />
                    <ErrorMessage
                    name="error" render ={() => <ValidationError errors={errors.error as unknown as string[]} /> }
                    />
                    <Button 
                        disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting} 
                        positive content="Register" 
                        type="submit" fluid />
                </Form>
            )}

        </Formik>
    )
})

// 153. register form. copy paste from login form for template. 
// changes: add properties displayName and username. also need validation - so using Yup in here. add checks for isValid and dirty.
// add 2 more MyTextInput for display name and username. and also change button func - disabled if.. and change text for semantics.

// 154. validation errors in the rego form - changed a bit of error handling logic? no more error message - just logs the error itself. 
// !! MIGHT NEED TO CHANGE SOMETHING HERE error => error .? 
// inside ErrorMessage - replace Label with ValidationErrors component. we get a linting error re type string[] from ValidationErrors - just need to specify the type. in the error it guides what to do - as unknown first then as string[]
// also need to add 'error' to Form class at the top. 