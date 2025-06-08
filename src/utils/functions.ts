export const formatRelativeTime = (date: string) => {
  const now = new Date();
  const orderDate = new Date(date);
  let diffInSeconds = Math.floor((now.getTime() - orderDate.getTime()) / 1000);
  if (diffInSeconds < 0) diffInSeconds = 0;

  if (diffInSeconds < 60) {
    return `${diffInSeconds}초 전`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}분 전`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  } else {
    return orderDate.toLocaleDateString();
  }
};
