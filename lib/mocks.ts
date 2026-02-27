export interface MockUser {
  username: string;
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  { username: "cliente1", password: "1234" },
  { username: "cliente2", password: "abcd" }
];

export interface Session {
  username: string;
}

