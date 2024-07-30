import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

export default observer(function ActivityDashboard() {
    
    const {activityStore} = useStore(); 
    const {loadActivities, activityRegistry, setPagingParams, pagination} = activityStore; // 241. add pagination related stuff.
    const [loadingNext, setLoadingNext] = useState(false); // 241. add local state to see if we are loading the next batch.

    function handleGetNext() { // 241. helper.
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false)); // loadActivities is getting its paramters from the store itself. when we update pagination params, causes axios computed prop to update, and that is what we pass ot the loadActivities.
    }

    useEffect(() => { //71. refactoring - commented out entire code
        if (activityRegistry.size <= 1) loadActivities(); // 89. adding checking to see if we already have activities inside the store
    }, [loadActivities, activityRegistry.size])  

    return (
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && activityRegistry.size === 0 && !loadingNext ? ( // adding additional check to get rif of flickers. we want to make sure we only use placeholders if activity registry has been reset to 0. 
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll 
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />  
                    </InfiniteScroll>
                )}
                
            </Grid.Column>
            <Grid.Column width='6'>
               <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )

})

// 84. activity details and activity form are being routed to now so can remove them as components

// 241. added button to test that pagination works. 
// 242. infinite scroll: removed button, adding inf scroll around the activity list component. infinite scroll requires attribute - pageStart. loadMore function takes in handler. hasMore tells API when to stop. 
// hasMore only takes boolean or undefined. our pagination is an object, so we need to cast it as a bool. initialLoad can be false, since we are taking care of that in our useEffect method. 
// we also want to add a loader underneath out list so we know something is happening as the user is scrolling down. (from semantic UI)

// 246. adding placeholders - new snippet inside features>activities>dashboard we made a new component from snippet with semantic UI placeholders. 
// got rid of full page loader, then added placeholders if loadinginitial and not loading next. otherwise display infinite scroll. 