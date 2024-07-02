import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from 'uuid';
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ActivityFormValues } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { createActivity, updateActivity,
        loadActivity, loadingInitial } = activityStore; // 83. removed closeForm bc when we cancel now, will be routing somewhere else
    const { id } = useParams();  // 85. to get access to route param - so we can get id from route parameters.
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues()); // 174. changed to activityFormValues that we created in Activity.ts. 

    const validationSchema = Yup.object({
        title: Yup.string().required("The activity title is required"),
        description: Yup.string().required("The activity description is required"),
        category: Yup.string().required(),
        date: Yup.string().required("Date is required").nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required(),

    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity))); // 174. updated to use ActivityFormValues to return activity and check act has the values inside the form itself. // 85. ! to turn off TS functionality that was spitting out an error - about the type of the value that is being returned.\
    }, [id, loadActivity]);

    function handleFormSubmit(activity: ActivityFormValues) { // 174. updated to ActivityFormValues.
        if (!activity.id) { //87. if we don't have an id
            activity.id = uuid(); // 87. then we will create one
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))

        }
    }




    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Header content="Activity Details" sub color="teal" />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>  {/* 55. editing activity and form basics */}
                        <MyTextInput name="title" placeholder="Title" />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput
                            placeholderText='Date'
                            name='date'
                            showTimeSelect
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        <Header content="Location Details" sub color="teal" />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} floated='right'  // 174. changed from loading to isSubmitting.
                            positive type='submit' content='Submit' />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' /> {/*add a link here so when we click cancel, we simply link back to the activities page.*/}
                    </Form>
                )}
            </Formik>

        </Segment>
    )
})


// 116. setting up formik - commented out handlesunbit and handleChange for now. 
// have also added Formik in return statement and added properties. 
// inside the formik bit - destructuring of the properties we want to pass down from formik to the form. handleChange and handleSubmit is a formik function (we had our own manual one before)
// 116. also added enableReinitialise at beginning on Formik component - so the form to be edited has the existing details.
// 117. Formik with less code - replacing form input and text area with MyTextInput from Formik. value attribute and onChange not needed any more. only need placeholder and name. 
// 119. creating reusable text input - connect validation of each field using Yup.object, then using MyTextInput that we created inside the render for validation. 
// 120. changed description to MyTextArea that we created.
// 121. adding MySelectInput and options attribute
// 125. handleFormSubmit - renamed and back in action. add activity as param. also inside the Formik properties - inside the onSubmit we call handleFormSubmit. also added a couple semantic ui headers
// 125. adding error message to date and making it nullable.
