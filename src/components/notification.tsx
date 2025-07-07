import { NotificationProps } from "@/constants";

export default function Notification({ open, message }: NotificationProps) {
  return (
    <>
      {open ? (
        <div className="toast" role="alert">
          <div
            className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8  rounded-lg`}
          ></div>
          <div className="ms-3 text-sm font-normal">{message}</div>
        </div>
      ) : null}
    </>
  );
}
