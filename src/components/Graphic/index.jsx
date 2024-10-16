import React from "react";

import wanderingMindImage from "../../assets/images/undraw_Wandering_mind_re_x2a3.png";

const Graphic = () => {
  return (
    <section className="w-full h-max flex flex-row justify-between gap-4 px-3 pt-24 md:px-7 lg:px-10">
      <div className="inline-flex w-full md:w-[35%]">
        <div className="w-full block">
          <img
            className="w-full block select-none"
            src={wanderingMindImage}
            alt="Wandering mind"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 [&_p]:m-0 overflow-hidden rounded-full aspect-square flex flex-row flex-wrap bg-red-500">
        <div className="w-1/2 aspect-square bg-blue-400 border-solid border-[2px] border-t-0 border-l-0 border-white">
          <p className="flex flex-row text-[14px] text-zinc-50 items-end justify-end text-right size-full p-4 font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            ratione corporis vel ullam accusantium quos harum a.
          </p>
        </div>
        <div className="w-1/2 aspect-square bg-red-400 border-solid border-[2px] border-t-0 border-r-0 border-white">
          <p className="flex flex-row text-[14px] text-zinc-50 items-end size-full p-4 font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            ratione corporis vel ullam accusantium quos harum a.
          </p>
        </div>
        <div className="w-1/2 aspect-square bg-green-400 border-solid border-[2px] border-b-0 border-l-0 border-white">
          <p className="flex flex-row text-[14px] text-zinc-50 justify-end text-right size-full p-4 font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            ratione corporis vel ullam accusantium quos harum a.
          </p>
        </div>
        <div className="w-1/2 aspect-square bg-yellow-400 border-solid border-[2px] border-b-0 border-r-0 border-white">
          <p className="flex flex-row text-[14px] text-zinc-50 size-full p-4 font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            ratione corporis vel ullam accusantium quos harum a.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Graphic;
