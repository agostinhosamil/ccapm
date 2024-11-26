import { useAuth } from "client@contexts/AuthContext";

export const MeetWrapper = (props: React.PropsWithChildren) => {
  const { user } = useAuth();

  if (!user) {
    return <div>Precisa iniciar sessão primeiro</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      {props.children}
    </div>
  );
};
