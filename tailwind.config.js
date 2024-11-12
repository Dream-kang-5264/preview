/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 根据您的项目结构调整路径
    "./public/index.html",         // 可选：确保公共文件也被扫描
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
