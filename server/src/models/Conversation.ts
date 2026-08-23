export type ConversationRecord = {
  id: string;
  name: string;
  members: string[];
};

const Conversation = {
  create: (conversation: ConversationRecord) => conversation,
};

export default Conversation;