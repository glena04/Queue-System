// Define a type for a Ticket
export interface Ticket {
    id: number;
    name: string;
  }
  
  // Define a type for a Service
  export interface Service {
    id: number;
    name: string;
    description: string;
  }
  
  // Define a type for User Authentication
  export interface User {
    email: string;
    password?: string; // Optional for cases where only the email is needed
  }
  
  // Define a type for Redux State
  export interface RootState {
    tickets: Ticket[];
    services: Service[];
    auth: {
      user: User | null;
    };
  }