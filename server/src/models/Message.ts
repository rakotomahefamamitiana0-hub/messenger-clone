export type MessageRecord = {
  id: string;
  sender: string;
  text: string;
  room: string;
  time: string;
};

const Message = {
  create: (message: MessageRecord) => message,
};

export default Message;