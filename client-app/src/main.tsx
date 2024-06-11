import React from 'react';
import ReactDOM from 'react-dom/client';
import 'semantic-ui-css/semantic.min.css';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './app/layout/styles.css';
import { StoreContext, store } from './app/stores/store';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes';

// 79. installing react router - changed the App comp below (between StoreContent.Provider tags) to RouterProvider and added router.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
    <RouterProvider router={router} /> 
    </StoreContext.Provider>
    
  </React.StrictMode>,
)


// 97. imported react calendar styling (make sure after semantic so not overridden)
//108. added toastify import to give us toast functionality + style. 
// 122. creating a reusable date input - adding react date picker import css file.
