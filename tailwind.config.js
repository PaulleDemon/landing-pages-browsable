/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: 'tw-',
	important: false,
	content: [
		"src/**/*.{html, jsx, js}",
		"src/**/*.js",
		"src/**/*.html",
	],
	theme: {
		extend: {
			colors: {
				primary: "#155eef"
			}
		},
	},
	plugins: [],
}

