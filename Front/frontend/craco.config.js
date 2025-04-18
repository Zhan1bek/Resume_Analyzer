// craco.config.js
module.exports = {
    style: {
        postcss: {
            plugins: [
                // require('tailwindcss'),
                require('autoprefixer'),
                // или если нужна замена на @tailwindcss/postcss:
                require('@tailwindcss/postcss'),
            ],
        },
    },
};
