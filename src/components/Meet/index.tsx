import { Nullable, range } from "@verdantkit/utils";
import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import ReactWebCam from "react-webcam";
import Peer from "simple-peer";

import { useAuth } from "client@contexts/AuthContext";
import { useSocket } from "client@hooks/useSocket";

import { MeetWrapper } from "./MeetWrapper";

type Params = {
  id: string;
};

type JoinMeetEvent = {
  meetToken: string;
  userId: string;
  signal: Peer.SignalData;
};

export const Meet = () => {
  const [meetStarted, setMeetStarted] = useState<boolean>(false);
  const [stream, setStream] = useState<Nullable<MediaStream>>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const myPeerRef = useRef<Nullable<Peer.Instance>>(null);

  const params = useParams<Params>();
  const { socket } = useSocket();
  const { user } = useAuth();

  const startMeetButtonClickHandler = () => {
    if (!stream) {
      return;
    }

    const peer = new Peer({
      stream,
      trickle: false,
      initiator: true,
    });

    myPeerRef.current = peer;

    peer.on("error", (e) => console.log(">>> Peer error: ", e));

    peer.on("open", (a) => {
      console.log(">>>> a: ", a);

      // peer.send("Hey");
    });

    peer.on("signal", (signal) => {
      console.log(">>> peer.on -> signal:", { signal });

      socket.emit("start-meet", {
        meetToken: params.id,
        userId: user?.id,
        signal,
      });
    });
  };

  const enterMeetButtonClickHandler = () => {
    if (!stream) {
      return;
    }

    console.log(">>> joining meet...");

    const peer = new Peer({
      stream,
      trickle: false,
      initiator: false,
    });

    myPeerRef.current = peer;

    peer.on("error", (e) => console.log(">>> Peer error: ", e));

    peer.on("open", (a) => {
      console.log(">>>> a: ", a);

      // peer.send("Hey");
    });

    peer.on("signal", (signal) => {
      console.log(">>> peer.on -> signal:", { signal });

      socket.emit("join-meet", {
        meetToken: params.id,
        userId: user?.id,
        signal,
      });
    });
  };

  useEffect(() => {
    if (!meetStarted) {
      // socket.emit("room", { room: params.id });
      // socket.on("meet-started", () => {
      //   if (!meetStarted) {
      //     console.log(">>> Meet already started");
      //   }
      //   setMeetStarted(true);
      // });
    }

    // if (!stream) {
    //   return;
    // }

    // console.log(">>> Dark: ", meetStarted);

    // const amITheFirstToJoin = !meetStarted;

    // const peer = new Peer({
    //   stream,
    //   trickle: false,
    //   initiator: amITheFirstToJoin,
    // });

    // peer.on("error", (e) => console.log(">>> Peer error: ", e));

    // peer.on("open", (a) => {
    //   console.log(">>>> a: ", a);

    //   // peer.send("Hey");
    // });

    // peer.on("signal", (signal) => {
    //   console.log(">>> signal:", { signal });

    //   socket.emit("join-meet", {
    //     meetToken: params.id,
    //     userId: user?.id,
    //     signal,
    //   });
    // });

    // peer.on("connect", () => {
    //   console.log(">>> peer connected");
    // });

    // peer.on("stream", (stream) => {
    //   if (videoRef.current instanceof HTMLVideoElement) {
    //     videoRef.current.srcObject = stream;
    //   }
    // });

    socket.on("user-joined", ({ signal }: JoinMeetEvent) => {
      // console.log(`>>> New user here: `, userId);
      console.log(
        ">>> new user signal: ",
        signal,
        "\n\n\n>>> myPeerRef.current:",
        myPeerRef.current
      );

      myPeerRef.current?.signal(signal);
    });

    return () => {
      // peer.destroy();
    };
  }, [stream]);

  return (
    <div className="w-full min-h-screen py-7 px-5 md:px-10 lg:px-24 xl:px-32">
      <MeetWrapper>
        <Row>
          <Col md={8}>
            <div className="w-full h-[440px] overflow-hidden rounded-lg shadow-xl relative flex flex-col justify-center border-[1px] border-solid border-zinc-300 items-center">
              <video
                ref={videoRef}
                className="size-full bg-zinc-200 object-cover rounded-lg"
              />
              {!meetStarted && (
                <div className="size-full absolute z-[3] top-0 left-0 bg-black bg-opacity-50 flex flex-col gap-4 justify-center items-center">
                  <button
                    type="button"
                    onClick={startMeetButtonClickHandler}
                    disabled={!stream}
                    className="py-3 px-7 rounded-lg shadow-lg border-0 outline-none bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all active:scale-90 text-zinc-50"
                  >
                    Iniciar reunião
                  </button>
                  <button
                    type="button"
                    onClick={enterMeetButtonClickHandler}
                    disabled={!stream}
                    className="py-3 px-7 rounded-lg shadow-lg border-0 outline-none bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all active:scale-90 text-zinc-50"
                  >
                    Entrar na reunião
                  </button>
                </div>
              )}
              <div className="absolute p-4 top-0 w-full left-0 right-0 flex flex-row justify-end gap-2 opacity-5 hover:opacity-100 transition-all">
                <button
                  className="bg-blue-400 active:scale-90 transition-transform hover:bg-blue-500"
                  type="button"
                >
                  Reagendar reunião
                </button>
                <button
                  className="bg-red-500  active:scale-90 transition-transform hover:bg-red-600"
                  type="button"
                >
                  Sair da reunião
                </button>
              </div>

              <div className="absolute z-[4] left-4 bottom-4 w-36 h-44 bg-zinc-600 border-[1px] border-zinc-500 border-solid shadow-lg rounded-lg">
                <ReactWebCam
                  className="size-full bg-zinc-200 object-cover rounded-lg"
                  onUserMedia={(stream) => setStream(stream)}
                  muted={true}
                />
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
      </MeetWrapper>
    </div>
  );
};
