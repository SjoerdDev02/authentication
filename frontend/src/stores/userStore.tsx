"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

export type User = {
  id: number
  name: string
  email: string
  phone: string | null
} | null

interface UserState {
  user: User
  // eslint-disable-next-line no-unused-vars
  setUser: (user: User) => void
  resetUser: () => void
}

type UserStoreContextValue = StoreApi<UserState> | null
const UserStoreContext = createContext<UserStoreContextValue>(null);

export const UserStoreProvider = ({
	children,
	initialUser,
}: {
  children: ReactNode
  initialUser: User
}) => {
	const [store] = useState(() =>
		createStore<UserState>((set) => ({
			user: initialUser,
			setUser: (user: User) => set({ user }),
			resetUser: () => set({ user: null }),
		})),
	);

	return <UserStoreContext.Provider value={store}>
		{children}
	</UserStoreContext.Provider>;
};

// eslint-disable-next-line no-unused-vars
export function useUserStore<T>(selector: (state: UserState) => T): T {
	const store = useContext(UserStoreContext);
	if (!store) throw new Error("Missing UserStoreProvider in the tree");

	return useStore(store, selector);
}

export const useUser = () => useUserStore((state) => state.user);
export const useSetUser = () => useUserStore((state) => state.setUser);
export const useResetUser = () => useUserStore((state) => state.resetUser);