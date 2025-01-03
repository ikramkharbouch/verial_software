import toast from 'react-hot-toast';

export const notifyLowStock = (message: string) => {
  toast.error(message, {
    position: "top-right", // Set position
    duration: 4000,       // Toast duration in milliseconds
  });
};
