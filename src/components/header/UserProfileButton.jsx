import { Fragment, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { FaPencil, FaTrash, FaUser } from "react-icons/fa6";

import { axios } from "@config/axios";
import { useApp } from "@contexts/AppContext";
import { useAuth } from "@contexts/AuthContext";
import { useAppointments } from "~/hooks/useAppointments";
import { UpdateAppointmentModal } from "./UpdateAppointmentModal";

export const UserProfileButton = () => {
  const [showUserProfileDialog, setShowUserProfileDialog] = useState(false);
  const [updatingAppointment, setUpdatingAppointment] = useState(false);

  const { user, requestSignIn } = useAuth();
  const { showAlert, resolvePromise } = useApp();
  const { deleteAppointment } = useAppointments();

  const useProfileButtonClickHandler = async (event) => {
    event.preventDefault();

    if (!user) {
      const signInResponse = await requestSignIn();

      console.log(">>> signInResponse:", signInResponse);
      return;
    }

    setShowUserProfileDialog(!showUserProfileDialog);
  };

  const messageButtonClickHandler = async () => {
    await showAlert({
      title: "Hey Man",
      description: "lorem ipsum dolor sit amet",
    });
  };

  const deleteAppointmentHandler = async (appointment) => {
    console.log("Ya");

    const shouldProceed = confirm("Cancelar agendamento.\nTem certeza?");

    if (!shouldProceed) {
      return;
    }

    const result = await resolvePromise(async () => {
      const response = await axios.delete(`/appointments/${appointment.id}`);

      if (response.status === 200) {
        alert("Sucesso\nAgendamento cancelado com sucesso");

        return true;
      }
    });

    if (result) {
      deleteAppointment(appointment.id);
    }
  };

  const editAppointmentHandler = async (appointment) => {
    const result = await resolvePromise(async () => {
      // const response = await axios.delete();
    });

    console.log(">>> appointment.id: ", appointment.id);

    setUpdatingAppointment(appointment);
  };

  return (
    <Fragment>
      {showUserProfileDialog && (
        <div className="flex size-full z-50 flex-row justify-center bg-zinc-950 bg-opacity-90 fixed left-0 top-0 overflow-y-auto">
          <div className="w-full max-w-5xl">
            <div className="w-full block">
              <div className="p-8 bg-white shadow mt-24 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                    <div>
                      <p className="font-bold text-gray-700 text-xl">22</p>
                      <p className="text-gray-400">Friends</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-xl">10</p>
                      <p className="text-gray-400">Photos</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 text-xl">89</p>
                      <p className="text-gray-400">Comments</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                    <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                      Connect
                    </button>
                    <button
                      onClick={messageButtonClickHandler}
                      className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                    >
                      Message
                    </button>
                  </div>
                </div>
                <div className="mt-20 text-center border-b pb-12">
                  <h1 className="text-4xl font-medium text-gray-700">
                    {user?.name},
                    <span className="font-light text-gray-500">27</span>
                  </h1>
                  <p className="font-light text-gray-600 mt-3">
                    Bucharest, Romania
                  </p>
                  <p className="mt-8 text-gray-500">
                    Solution Manager - Creative Tim Officer
                  </p>
                  <p className="mt-2 text-gray-500">
                    University of Computer Science
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  {user?.appointments instanceof Array &&
                    user.appointments.length >= 1 && (
                      <div className="w-full flex flex-col gap-3 py-4">
                        <ul className="w-full flex flex-col gap-2">
                          {user.appointments.map((appointment) => (
                            <li
                              key={appointment.id}
                              className="flex w-full flex-row gap-5 items-center bg-zinc-100 p-4 rounded-lg"
                            >
                              <strong className="flex w-full">
                                {appointment.description}
                              </strong>
                              <i className="flex whitespace-nowrap text-zinc-500">
                                {appointment.date}
                              </i>
                              <div className="flex flex-row gap-2">
                                <button
                                  onClick={() =>
                                    editAppointmentHandler(appointment)
                                  }
                                  className="h-8 rounded-lg bg-blue-400 hover:bg-blue-500 active:bg-blue-600 flex flex-row items-center justify-center text-white border-0"
                                >
                                  <FaPencil />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteAppointmentHandler(appointment)
                                  }
                                  className="h-8 rounded-lg bg-red-400 hover:bg-red-500 active:bg-red-600 flex flex-row items-center justify-center text-white border-0"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  <button
                    className="text-indigo-500 py-2 px-4 border-0 outline-none bg-zinc-200 rounded-xl font-medium mt-4"
                    onClick={() => setShowUserProfileDialog(false)}
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Nav.Link href="/me" onClick={useProfileButtonClickHandler}>
        <i className="size-10 rounded-full bg-white flex flex-row justify-center items-center text-emerald-950">
          <FaUser />
        </i>
      </Nav.Link>
      <UpdateAppointmentModal
        show={!!updatingAppointment}
        appointment={updatingAppointment}
        handleClose={() => setUpdatingAppointment(false)}
      />
    </Fragment>
  );
};
