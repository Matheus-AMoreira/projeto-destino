import { logout } from "@/utils/auth/authFunctions";
import { create } from "zustand";

type UserState = {
  id: string;
  email: string;
  isLoged: boolean;
};

type UserActions = {
  logoutUser: () => void;
  updateUser: (userInfo: UserState) => void;
};

export const useSession = create<UserState & UserActions>((set) => ({
  id: "",
  email: "",
  isLoged: false,

  logoutUser: () => (
    logout(),
    set({
      id: "",
      email: "",
      isLoged: false,
    })
  ),
  updateUser: (userInfo) => {
    set(() => ({
      id: userInfo.id,
      email: userInfo.email,
      isLoged: userInfo.isLoged,
    }));
  },
}));
