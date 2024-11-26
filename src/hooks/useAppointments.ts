import { useAuth } from "client@contexts/AuthContext";
import { Appointment } from "client@types/Appointment";

export const useAppointments = () => {
  const { user, setUser } = useAuth();

  return {
    appointments: user?.appointments ?? [],

    addAppointment: (appointment: Appointment) => {
      if (!user) {
        return;
      }

      const currentUserAppointments =
        user.appointments instanceof Array ? user.appointments : [];

      setUser({
        ...user,
        appointments: [...currentUserAppointments, appointment],
      });
    },

    deleteAppointment: (appointmentId: string) => {
      if (!user) {
        return;
      }

      setUser({
        ...user,
        appointments: user.appointments.filter(
          ({ id }) => id !== appointmentId
        ),
      });
    },

    updateAppointment: (
      appointmentId: string,
      appointment: Partial<Appointment>
    ) => {
      if (!user) {
        return;
      }

      setUser({
        ...user,
        appointments: user.appointments.map((appointmentData) => {
          if (appointmentData.id !== appointmentId) {
            return appointmentData;
          }

          return {
            ...appointmentData,
            ...appointment,
          };
        }),
      });
    },
  };
};
