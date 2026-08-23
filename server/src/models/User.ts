export type UserRecord = {
  id: string;
  username: string;
  email: string;
  password: string;
};

const User = {
  create: (user: UserRecord) => user,
};

export default User;