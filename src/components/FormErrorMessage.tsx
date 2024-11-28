import { useEffect, useRef } from "react";

type FormErrorMessageProps = React.PropsWithRef<{
  message: string;
}>;

type FormErrorMessageComponent = React.FunctionComponent<FormErrorMessageProps>;

export const FormErrorMessage: FormErrorMessageComponent = ({ message }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const windowScrollHandler = () => {
      const element = elementRef.current;

      if (element instanceof HTMLDivElement) {
        const elementsCoords = element.getBoundingClientRect();

        if (elementsCoords.y < 0) {
          element.setAttribute("data-fixed", "true");
        } else {
          // element.setAttribute("data-fixed", "false");
        }
      }
    };

    windowScrollHandler();

    window.document.addEventListener("scroll", windowScrollHandler);

    return () => {
      window.document.removeEventListener("scroll", windowScrollHandler);
    };
  }, []);

  return (
    <div
      data-fixed="false"
      ref={elementRef}
      className="w-full p-3 my-3 bg-red-100 border-[1px] border-solid border-red-800 text-red-800 rounded-lg shadow-sm data-[fixed=true]:fixed top-3 left-auto right-auto data-[fixed=true]:w-[96%] m-auto"
    >
      <span>{message}</span>
    </div>
  );
};
