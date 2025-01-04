export const uniqueItems = (arr) => {
  const uniqueArr = [];
  const ids = new Set();

  arr.forEach((item) => {
    if (!ids.has(item.user.id)) {
      uniqueArr.push(item);
      ids.add(item.user.id);
    }
  });

  return uniqueArr;
};

export const getDateDDMMYYYY = () => new Date().toLocaleDateString("ru-RU");

export const getDateTime = () => new Date().toLocaleString("ru-RU");
