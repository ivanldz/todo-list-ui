/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en"],
	},
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['localhost'],
	},
}

module.exports = nextConfig
