export type Route = '/' | '/login' | '/register' | '/update' | '/otc' | '/reset-password';
export type Page = 'Home' | 'Login' | 'Register' | 'Update' | 'Otc' | 'ResetPassword';

export const pages = {
	'Home': {
		path: '/',
		protected: true
	},
	'Login': {
		path: '/login',
		protected: false
	},
	'Register': {
		path: '/register',
		protected: false
	},
	'Update': {
		path: '/update',
		protected: true
	},
	'Otc': {
		path: '/otc',
		protected: false
	},
	'ResetPassword': {
		path: '/reset-password',
		protected: false
	}
} satisfies Record<Page, { path: Route, protected: boolean }>;

export const routeUrlToPageMap = {
	'/': {
		page: 'Home',
		protected: true
	},
	'/login': {
		page: 'Login',
		protected: false
	},
	'/register': {
		page: 'Register',
		protected: false
	},
	'/update': {
		page: 'Update',
		protected: true
	},
	'/otc': {
		page: 'Otc',
		protected: false
	 },
	 '/reset-password': {
		page: 'ResetPassword',
		protected: false
	 }
} satisfies Record<Route, { page: Page, protected: boolean }>;
