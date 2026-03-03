import { useAuthContext } from "./../contexte/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};
