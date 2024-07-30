import { observer } from "mobx-react-lite";
import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";


export default observer(function ActivityFilters() {
    const {activityStore: {predicate, setPredicate}} = useStore(); // 245.
    return (
        <>
            <Menu vertical size="large" style={{ width: '100%', marginTop: 28}}>
                <Header icon='filter' attached color="teal" content='Filters' />
                <Menu.Item 
                    content='All Activities' 
                    active={predicate.has("all")}
                    onClick={() => setPredicate("all", "true")}
                />
                <Menu.Item 
                    content="I'm going" 
                    active={predicate.has("isGoing")}
                    onClick={() => setPredicate("isGoing", "true")}
                />
                <Menu.Item 
                    content="I'm hosting" 
                    active={predicate.has("isHost")}
                    onClick={() => setPredicate("isHost", "true")}
                />
            </Menu>
            <Header />
            <Calendar 
                onChange={(date) => setPredicate("startDate", date as Date)}
                value={predicate.get("startDate") || new Date}
            />
        </>

    )
})

//97. added calendar and filters. did some styling of cal and comp.

// 245. updating filter component - we have the API done so we can filter. now client side. 
// make component an observer first. 
// add activityStore and useStore so we can access the methods and data that we need. 
// in the menu item, we want to make it active if the predicate is set to what it is. in the API, we have made it so that only one can be selected, so no need to disable here. 
// then the calendar: give onChange to setPredicate.