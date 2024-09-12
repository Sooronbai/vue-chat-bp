export const getUserName = (userId, users) => {
  const user = users.find((user) => user.id === userId);
  return user ? user.name : "Неизвестный";
};

export function generateChatId(user1Id, user2Id) {
  return [user1Id, user2Id].sort().join("-");
}
