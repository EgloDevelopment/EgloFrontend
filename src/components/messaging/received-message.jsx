function Component(props) {
  const DATE_OPTIONS = {
    minute: "numeric",
    hour: "numeric",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: false,
  };
  return (
    <>
      <div className="">
        <div className="chat chat-start">
          <div className="chat-image avatar ml-2">
            <div
              className="w-10 rounded-full cursor-pointer"
              onClick={() => {
                props.showUserData(props.senderID)
              }}
            >
              <img
                src={
                  "https://api.dicebear.com/6.x/initials/svg?seed=" +
                  props.senderName +
                  "&backgroundType=gradientLinear"
                }
              />
            </div>
          </div>
          <div
            className="chat-header cursor-pointer"
            onClick={() => {
              props.showUserData(props.senderID)
            }}
          >
            {props.senderName}
          </div>
          <div className="chat-bubble">{props.content}</div>
          <div className="chat-footer opacity-50">
            {new Date(props.time).toLocaleDateString("en-US", DATE_OPTIONS)}
          </div>
        </div>
      </div>
    </>
  );
}

export default Component;
