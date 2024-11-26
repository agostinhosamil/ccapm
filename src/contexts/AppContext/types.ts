import { Nullable } from "@verdantkit/utils";

export type AlertProps = {
  title: string;
  description: string;
};

export type DefaultHandler<R = any> = () => R;

export type AppContextDataObject = {
  showAlert: (alertProps: AlertProps) => Promise<any>;

  resolvePromise: <R = any>(
    promiseHandler: DefaultHandler<R>
  ) => Promise<Nullable<ReturnType<typeof promiseHandler>>>;
};
