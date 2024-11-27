import { FaX } from "react-icons/fa6";

import { formDataToJson } from "@verdantkit/utils";
import { useApp } from "client@hooks/useApp";
import { useRef, useState } from "react";
import { z } from "zod";
import { DefaultHandler } from "./types";

type LoginFormProps = {
  onClose?: DefaultHandler;
  onSubmit?: React.FormEventHandler;
};

const LoginFormSchema = z.object({
  user: z.object({
    username: z.string().email("O email fornecido não é válido"),
    password: z
      .string()
      .min(6, "A palavra passe deve conter ao menos 6 caracteres"),
  }),
});

export const LoginForm = ({ onSubmit, onClose }: LoginFormProps) => {
  const [formError, setFormError] = useState<
    z.ZodIssue | { message: string }
  >();

  const app = useApp();

  const formRef = useRef<HTMLFormElement>(null);

  const closeButtonClickHandler = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const formSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof onSubmit !== "function") {
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const loginData = formDataToJson(formData);

    const validatedFormData = LoginFormSchema.safeParse(loginData);

    if (validatedFormData.error) {
      const { errors } = validatedFormData.error;

      setFormError(errors[0]);

      return;
    }

    app.resolvePromise(async () => {
      const response = await onSubmit(event);

      if (!(typeof response === "boolean" && response)) {
        setFormError({
          message: "Usuário ou senha incorreto",
        });
      }
    });
  };

  const throwErrorIfFieldIsInvalid = (
    dataSchema: z.ZodString,
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const validatedData = dataSchema.safeParse(event.target.value);

    if (validatedData.error) {
      return setFormError(validatedData.error.errors[0]);
    }

    setFormError(undefined);
  };

  const usernameFieldBlurHandler = (
    event: React.FocusEvent<HTMLInputElement>
  ) =>
    throwErrorIfFieldIsInvalid(
      z.string().email("O email fornecido não é válido"),
      event
    );

  const passwordFieldBlurHandler = (
    event: React.FocusEvent<HTMLInputElement>
  ) =>
    throwErrorIfFieldIsInvalid(
      z.string().min(6, "A palavra passe deve conter ao menos 6 caracteres"),
      event
    );

  return (
    <div className="flex size-full z-50 flex-row justify-center bg-zinc-950 bg-opacity-90 fixed left-0 top-0 overflow-y-auto">
      <div className="fixed size-10 right-6 top-6">
        <button
          className="border-0 outline-none flex flex-row justify-center items-center bg-zinc-800 text-zinc-100 size-10 rounded-full hover:scale-105 active:scale-90 transition-transform"
          onClick={closeButtonClickHandler}
        >
          <i>
            <FaX size={12} />
          </i>
        </button>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center max-w-3xl">
        <div className="w-full">
          <div className="w-full flex flex-col">
            <section className="w-full flex">
              <div className="flex w-full flex-col items-center justify-center py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Iniciar sessão
                    </h1>
                    <form
                      className="space-y-4 md:space-y-6"
                      action="#"
                      method="post"
                      onSubmit={formSubmitHandler}
                      ref={formRef}
                    >
                      {formError && (
                        <div className="w-full p-3 my-3 bg-red-100 border-[1px] border-solid border-red-800 text-red-800 rounded-lg shadow-sm">
                          <span>{formError.message}</span>
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email, telefone ou nome de utilizador
                        </label>
                        <input
                          type="text"
                          name="user[username]"
                          autoComplete="off"
                          id="email"
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="name@company.com"
                          onBlur={usernameFieldBlurHandler}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Palavra passe
                        </label>
                        <input
                          type="password"
                          name="user[password]"
                          id="password"
                          placeholder="••••••••"
                          onBlur={passwordFieldBlurHandler}
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="remember"
                              type="checkbox"
                              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="remember"
                              className="text-gray-500 dark:text-gray-300"
                            >
                              Manter-me contacto
                            </label>
                          </div>
                        </div>
                        <a
                          href="#"
                          className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                          Esqueceu a palavra passe?
                        </a>
                      </div>
                      <button
                        type="submit"
                        disabled={!!formError}
                        className="w-full text-white border-0 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        Sign in
                      </button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Ainda não tem uma conta?{" "}
                        <a
                          href="/register"
                          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                          Criar conta
                        </a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
