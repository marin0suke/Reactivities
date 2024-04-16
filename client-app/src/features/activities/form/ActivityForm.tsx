import { useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from 'uuid';

export default observer(function ActivityForm() {
    const {activityStore} = useStore();
    const {createActivity, updateActivity, 
        loading, loadActivity, loadingInitial} = activityStore; // 83. removed closeForm bc when we cancel now, will be routing somewhere else
    const {id} = useParams();  // 85. to get access to route param - so we can get id from route parameters.
    const navigate = useNavigate();
    
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!)); // 85. ! to turn off TS functionality that was spitting out an error - about the type of the value that is being returned.\
    }, [id, loadActivity]);

    function handleSubmit() {
        if (!activity.id) { //87. if we don't have an id
            activity.id = uuid(); // 87. then we will create one
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))

        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

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
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' /> {/*add a link here so when we click cancel, we simply link back to the activities page.*/}
            </Form>
        </Segment>
    )
})