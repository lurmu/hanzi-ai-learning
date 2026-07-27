module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        success: '#52C41A',
        warning: '#FAAD14',
        danger: '#F5222D',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
