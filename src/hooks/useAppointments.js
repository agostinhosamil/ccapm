import { useAuth } from "@contexts/AuthContext";

export const useAppointments = () => {
  const { user, setUser } = useAuth();

  return {
    appointments: user?.appointments ?? [],

    addAppointment: (appointment) => {
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

    deleteAppointment: (appointmentId) => {
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

    updateAppointment: (appointmentId, appointment) => {
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
