import {Button, Header, Segment} from "semantic-ui-react";
import axios from 'axios';
import { useState } from "react";
import ValidationError from "./ValidationError";

export default function TestErrors() {
    const baseUrl = 'http://localhost:5000/api/'  
    const[errors, setErrors] = useState(null);


    function handleNotFound() {
        axios.get(baseUrl + 'buggy/not-found').catch(err => console.log(err.response));
    }

    function handleBadRequest() {
        axios.get(baseUrl + 'buggy/bad-request').catch(err => console.log(err.response));
    }

    function handleServerError() {
        axios.get(baseUrl + 'buggy/server-error').catch(err => console.log(err.response));
    }

    function handleUnauthorised() {
        axios.get(baseUrl + 'buggy/unauthorised').catch(err => console.log(err.response));
    }

    function handleBadGuid() {
        axios.get(baseUrl + 'activities/notaguid').catch(err => console.log(err.response));
    }

    function handleValidationError() {
        axios.post(baseUrl + 'activities', {}).catch(err => setErrors(err));
    }

    return (
        <>
            <Header as='h1' content='Test Error component' />
            <Segment>
                <Button.Group widths='7'>
                    <Button onClick={handleNotFound} content='Not Found' basic primary />
                    <Button onClick={handleBadRequest} content='Bad Request' basic primary />
                    <Button onClick={handleValidationError} content='Validation Error' basic primary />
                    <Button onClick={handleServerError} content='Server Error' basic primary />
                    <Button onClick={handleUnauthorised} content='Unauthorised' basic primary />
                    <Button onClick={handleBadGuid} content='Bad Guid' basic primary />
                </Button.Group>
            </Segment>
            {errors && <ValidationError errors={errors} />}
        </>
    )
}


//108. prepping error handling for in client app - whole above was snipet in student assets to test errors. new folder created under features and this new comp created.

//111. handling 400 errors - we changed the toast in agent.ts to be a conditional that takes the error messages (within data), puts em in array, flat(), which means we lose nested arrays? so here line 28 needed to be changed
//from err.reponse to just err, since there will be no response post flattening. 
// 111. also added another useState at top of function. for setError.
// 111. also added a conditional bit inside return statement - errors + validationError errors.
//111. also replaced err => console.log in handleValidationError to setError method with err as param.