import { noEmpty, Nullish } from "@verdantkit/utils";
import { Fragment, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa6";

type DateSelectFieldProps = {
  defaultValue?: Nullish<{
    date: string;
    time: string;
  }>;
  fieldKeyTemplate?: string;
};

type DateSelectFieldComponent = React.FunctionComponent<DateSelectFieldProps>;

const generateDateRange = (
  min: number = 0,
  max: number = 20
): Array<string> => {
  const dateRange: Array<string> = [];

  let date = new Date(Date.now());

  const day = date.getDate();

  for (let i = min; i <= min + max; i++) {
    date.setDate(day + i);

    dateRange.push(
      [date.getDate(), date.getMonth(), date.getFullYear()].join("/")
    );
  }

  return dateRange;
};

type TimeData = {
  hour: number;
  min: number;
};

const generateTimeRange = (): Array<TimeData> => {
  const timeRange: Array<TimeData> = [];

  const closingTime: TimeData = {
    hour: 28,
    min: 0,
  };

  let currentHours: TimeData = {
    hour: new Date(Date.now()).getHours() + 1,
    min: 0,
  };

  const mins = [0, 15, 30, 45];

  for (let i = currentHours.hour; i <= closingTime.hour; i++) {
    for (const min of mins) {
      if (closingTime.hour <= i && closingTime.min < min) {
        continue;
      }

      timeRange.push({
        hour: i,
        min,
      });
    }
  }

  return timeRange;
};

export const DateSelectField: DateSelectFieldComponent = (props) => {
  const [time, setTime] = useState<string>();
  const [date, setDate] = useState<string>();
  const [dateRangeStart, setDateRangeStart] = useState(0);

  const DATE_RANGE_INTERVAL = 23;

  const dateRange = generateDateRange(dateRangeStart, DATE_RANGE_INTERVAL);
  const timeRange = generateTimeRange();

  const fieldName = (key: string): string => {
    const template = props.fieldKeyTemplate;

    if (noEmpty(template)) {
      return template.replace("$0", key);
    }

    return key;
  };

  const timeToString = (time: TimeData): string => {
    const str = Object.values(time)
      .map((v) => (v < 10 ? `0${v}` : v))
      .join(":");
    return str;
  };

  const selectingTime = !noEmpty(date);

  return (
    <Fragment>
      <div className="w-full flex flex-col gap-2 py-2">
        {(selectingTime && (
          <Fragment>
            <span>
              Selecionar data - (Dentro de{" "}
              {Math.ceil((dateRangeStart + DATE_RANGE_INTERVAL) / 7)} semanas)
            </span>
            <div className="w-full flex flex-row gap-2 flex-wrap py-2">
              {dateRange.map((date, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDate(date.split("/").join("-"));
                  }}
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
          </Fragment>
        )) || (
          <Fragment>
            <div className="w-full flex flex-row justify-between items-center">
              <span>Selecionar horário - ({date})</span>
              <div className="inline-flex items-center">
                <button
                  type="button"
                  className="bg-transparent border-0 outline-none p-0 text-zinc-500 hover:underline hover:text-zinc-700"
                  onClick={() => setDate(undefined)}
                >
                  <span className="text-xs font-bold">
                    Selecionar data novamente
                  </span>
                </button>
              </div>
            </div>
            <div className="w-full flex flex-row gap-2 flex-wrap pt-2">
              <div className="w-full flex flex-row gap-2 flex-wrap py-2">
                {timeRange.map((currentTime, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTime(timeToString(currentTime));
                    }}
                    type="button"
                    data-active={timeToString(currentTime) === time}
                    className="flex flex-grow flex-row justify-center items-center bg-zinc-200 outline-none border-0 hover:bg-zinc-300 active:bg-zinc-400 text-zinc-800 px-6 py-2 rounded-lg text-xs data-[active=true]:bg-emerald-400 data-[active=true]:hover:bg-emerald-500 data-[active=true]:active:bg-emerald-600 data-[active=true]:text-zinc-50"
                  >
                    {timeToString(currentTime)}
                  </button>
                ))}
              </div>
            </div>
          </Fragment>
        )}
      </div>
      <input
        type="hidden"
        name={fieldName("time")}
        value={time ?? ""}
        readOnly
      />
      <input
        type="hidden"
        name={fieldName("date")}
        value={date ?? ""}
        readOnly
      />
    </Fragment>
  );
};
