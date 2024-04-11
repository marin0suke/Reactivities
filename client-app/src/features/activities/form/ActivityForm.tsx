import { useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

// interface Props {
//     // activity: Activity | undefined;  73. no longer needed, remove parameters below also
//     // closeForm: () => void;
//     createOrEdit: (activity: Activity) => void;
//     submitting: boolean;
// }

export default observer(function ActivityForm() {
    const {activityStore} = useStore();
    const {selectedActivity, closeForm, createActivity, updateActivity, loading} = activityStore;

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState); // 55. editing activity and form basics - i'm getting errors neil isn't though

    function handleSubmit() {
        activity.id ? updateActivity(activity) : createActivity(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    return (
        <Segment clearing> 
            <Form onSubmit={handleSubmit} autoComplete='off'>  {/* 55. editing activity and form basics */}
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} /> {/* adding the value prop here will break title input in the form, so we need to give an onChange so react can update */}
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})