import { range } from "@verdantkit/utils";
import { Col, Row } from "react-bootstrap";
import { FaPencil, FaTrash } from "react-icons/fa6";
import ReactWebCam from "react-webcam";

export const Chat = () => {
  return (
    <div className="w-full min-h-screen py-7 px-5 md:px-10 lg:px-24 xl:px-32">
      <Row>
        <Col md={8}>
          <div className="w-full h-[440px] overflow-hidden rounded-lg shadow-xl relative flex flex-col justify-center border-[1px] border-solid border-zinc-300 items-center">
            <ReactWebCam className="size-full bg-zinc-200 object-cover rounded-lg" />
            <div className="absolute p-4 top-0 w-full left-0 right-0 flex flex-row justify-end gap-2 opacity-5 hover:opacity-100 transition-all">
              <button className="bg-blue-400" type="button">
                Reagendar reunião
              </button>
              <button className="bg-red-500" type="button">
                Sair da reunião
              </button>
            </div>

            <div className="absolute left-4 bottom-4 w-36 h-44 bg-zinc-600 border-[1px] border-zinc-500 border-solid shadow-lg rounded-lg">
              <ReactWebCam className="size-full bg-zinc-200 object-cover rounded-lg" />
            </div>
          </div>
          <div className="w-full flex flex-row gap-6 items-center justify-center py-5">
            {range(1, 7).map((i) => (
              <div
                className="size-16 shadow-sm cursor-pointer transition-all hover:scale-110 active:scale-95 rounded-full bg-emerald-300 bg-no-repeat bg-center bg-cover"
                key={i}
              ></div>
            ))}
          </div>
        </Col>
        <Col md={4}>
          <div className="w-full h-[440px] p-7 bg-white border-[1px] flex flex-col gap-4 border-solid border-zinc-200 shadow-md relative rounded-md">
            <h5 className="font-bold m-0 p-0 uppercase text-sm">
              Apontamentos
            </h5>
            <ul className="w-full flex flex-col gap-4 flex-grow overflow-y-auto scrollbar-thumb-zinc-400 scrollbar-track-transparent scrollbar-thin">
              {range(1, 3).map((i) => (
                <li
                  key={i}
                  className="w-full p-4 bg-zinc-100 flex flex-col gap-3 rounded-md"
                >
                  <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quos recusandae vero doloremque.
                  </span>
                  <div className="w-full flex flex-row gap-4 items-center justify-end">
                    <div>
                      <button
                        type="button"
                        className="size-auto bg-transparent text-zinc-600 hover:text-zinc-700 active:text-zinc-800 active:scale-90 transition-transform text-sm p-0 border-0 outline-none"
                      >
                        <i>
                          <FaPencil />
                        </i>
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="size-auto bg-transparent text-zinc-600 hover:text-zinc-700 active:text-zinc-800 active:scale-90 transition-transform text-sm p-0 border-0 outline-none"
                      >
                        <i>
                          <FaTrash />
                        </i>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div>
              <input
                type="text"
                placeholder="Escreva uma anotação"
                className="w-full py-2 px-3 rounded-full shadow-md"
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
