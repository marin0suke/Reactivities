import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Formik, Form } from "formik";
import * as Yup from 'yup'; // manually added bc doesn't come up auto.
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { Button } from "semantic-ui-react";

interface Props {
    setEditMode: (editMode: boolean) => void; // so we can close the form when finished.
}


export default observer(function ProfileEditForm({setEditMode}: Props) {
    const { profileStore: {profile, updateProfile} } = useStore(); 
    return (
        <Formik
            initialValues={{displayName: profile?.displayName, bio: profile?.bio}}
            onSubmit={values => {
                updateProfile(values).then(() => { // uses method we created in profile store. updateprofile.
                    setEditMode(false); // exits out of edit mode. need to add this in interface at top so can use props.
                })
            }}
            validationSchema={Yup.object({
                displayName: Yup.string().required()
            })}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form className="ui form">
                    <MyTextInput placeholder="Display Name" 
                        name="displayName" />
                    <MyTextArea rows={3} placeholder="Add your bio" 
                        name="bio" />
                    <Button 
                        positive
                        type="submit"
                        loading={isSubmitting}
                        content="Update profile"
                        floated="right"
                        disabled={!isValid || !dirty}
                    />
                </Form>
            )}
        </Formik>
    )
})



// Section 18 challenge. create profileedit component. ysing useState in parent component. - so we can turn ogg the editmode once the submission is complete. 
// 

// 1. export default function name function
// 2. make it an observer. + make sure to import observer from mobx
// 3. useStore const. import from store.
// 4. add profile and updateProfile from profile store in useStore.
// 5. open return statement and add Formik element. must add initialValues and onSubmit properties.
// 6. the initial values include what we are wanting to edit. onSubmit will include the method we created in the profileStore. arrow function to take values and do what we want with each of them.
// 7. add props interface for setEditMode. add destructured prop to the function.
// 8. validationSchema from Yup to add to Formik - form validation things.
// 9. inside Formik, add form validation properties arrow function.
// 10. inside function, add Form element with test input and text area comps we created. + a button to submit.