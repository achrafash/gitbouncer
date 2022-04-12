module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: [
                "JetBrains Mono",
                "system-ui",
                "-apple-system",
                "Segoe UI",
                "Roboto",
            ],
        },
        extend: {},
    },
    plugins: [require("@tailwindcss/line-clamp")],
}
