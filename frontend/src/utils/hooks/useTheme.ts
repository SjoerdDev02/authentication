'use client';

import { useEffect, useState } from "react";

import { getClientCookie, setCookie } from "@/utils/preferences/cookies";

import { ThemeType } from "../preferences/preferences";

function useTheme() {
	const [theme, setTheme] = useState<ThemeType>();

	useEffect(() => {
		if (!theme) {
			const initialTheme = document.documentElement.getAttribute('data-theme') as ThemeType;

			if (!getClientCookie('theme')) {
				setCookie('theme', initialTheme, 100);
			}

			setTheme(initialTheme);

			return;
		}

		document.documentElement.setAttribute('data-theme', theme);
		setCookie('theme', theme, 5);
	}, [theme]);

	return { theme, setTheme };
}

export default useTheme;
