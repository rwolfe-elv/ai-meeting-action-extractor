import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ellevelle-blue': '#5563C1',
        'ellevelle-teal': '#4DB8A8',
        'ellevelle-light': '#F8F9FC',
      },
    },
  },
  plugins: [],
};

export default config;
