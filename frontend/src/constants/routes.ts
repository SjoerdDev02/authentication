type Route = {
    path: string;
    protected: boolean;
}

export const routes = [
	{
		path: '/',
		protected: true
	},
	{
		path: '/login',
		protected: false
	},
	{
		path: '/register',
		protected: false
	},
	{
		path: '/update',
		protected: true
	},
	{
		path: '/otc',
		protected: false
	}
] satisfies Route[];