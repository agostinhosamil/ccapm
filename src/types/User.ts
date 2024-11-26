import { Appointment } from "./Appointment";

export type User = {
  id: string;
  name: string;
  email: string;
  appointments: Array<Appointment>;
};
