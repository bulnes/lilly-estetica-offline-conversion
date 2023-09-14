export const generateUniqueId = () => {
  const random = Math.random().toString(36).substring(2);
  const now = Date.now().toString(36);
  const uniqueId = `${random + now}`;

  return uniqueId.toUpperCase();
};
