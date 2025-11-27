type UnauthorizedListener = () => void;

const listeners = new Set<UnauthorizedListener>();

export const subscribeUnauthorized = (listener: UnauthorizedListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const emitUnauthorized = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error("Unauthorized listener error:", error);
    }
  });
};

