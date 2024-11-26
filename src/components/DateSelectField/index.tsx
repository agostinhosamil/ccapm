import { Nullish } from "@verdantkit/utils";
import { useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa6";

type DateSelectFieldProps = {
  defaultValue?: Nullish<{
    date: string;
    time: string;
  }>;
};

type DateSelectFieldComponent = React.FunctionComponent<DateSelectFieldProps>;

const generateDateRange = (
  min: number = 0,
  max: number = 20
): Array<string> => {
  const dateRange: Array<string> = [];

  let date = new Date(Date.now());

  for (let i = min; i <= min + max; i++) {
    date.setDate(date.getDate() + i);

    dateRange.push(
      [date.getDate(), date.getMonth(), date.getFullYear()].join("/")
    );
  }

  return dateRange;
};

export const DateSelectField: DateSelectFieldComponent = () => {
  const [dateRangeStart, setDateRangeStart] = useState(0);

  const DATE_RANGE_INTERVAL = 25;

  const dateRange = generateDateRange(dateRangeStart, DATE_RANGE_INTERVAL);

  return (
    <div className="w-full flex flex-col gap-2 py-2">
      <span>Selecionar data</span>
      <div className="w-full flex flex-row gap-2 flex-wrap py-2">
        {dateRange.map((date, i) => (
          <button
            key={i}
            type="button"
            className="flex flex-grow flex-row justify-center items-center bg-zinc-200 outline-none border-0 hover:bg-zinc-300 active:bg-zinc-400 text-zinc-800 px-6 py-2 rounded-lg text-xs"
          >
            {date}
          </button>
        ))}
      </div>
      <div className="w-full flex flex-row justify-between items-center">
        <div className="inline-flex">
          <button
            type="button"
            disabled={dateRangeStart < 1}
            onClick={() => setDateRangeStart(dateRangeStart - 1)}
            className="px-2 py-1 bg-zinc-200 text-zinc-800 outline-none border-0 disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <i>
              <FaAngleLeft />
            </i>
          </button>
        </div>
        <div className="inline-flex">
          <button
            type="button"
            onClick={() => setDateRangeStart(dateRangeStart + 1)}
            className="px-2 py-1 bg-zinc-200 text-zinc-800 outline-none border-0"
          >
            <i>
              <FaAngleRight />
            </i>
          </button>
        </div>
      </div>
    </div>
  );
};
