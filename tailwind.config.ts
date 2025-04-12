// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        turquoise: '#1DE9B6', // example color
      },
    },
  },
  plugins: [],
};

export default config;
