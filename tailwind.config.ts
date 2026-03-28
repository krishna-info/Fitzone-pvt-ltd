import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent:    'var(--color-accent)',
          surface:   'var(--color-surface)',
          muted:     'var(--color-muted)',
          dark:      'var(--color-dark)',
        }
      },
      boxShadow: {
        'card':      '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 8px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.10)',
        'float':     '0 8px 32px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        'brand':    '8px',
        'brand-lg': '16px',
      }
    },
  },
  plugins: [],
};
export default config;
