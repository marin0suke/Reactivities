export interface Activity {
    id: string;
    title: string;
    date: Date |  null;
    description: string;
    category: string;
    city: string;
    venue: string;
  }

  //123. date strategy - changed type date to Date from string (after changing with react datepicker)
  //123. also allowing for null type. addition