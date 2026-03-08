export const calculateDeliveryPrice = (distance) => {

  if (distance <= 5) return 0;

  if (distance <= 15) return 500;

  return 1000;

};