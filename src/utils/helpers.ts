export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const truncateHash = (hash: string): string => {
  return hash.length > 20 ? hash.substring(0, 20) + '...' : hash;
};

export const validateFaceImage = (base64: string): boolean => {
  return base64.length > 1000 && base64.length < 500000;
};
