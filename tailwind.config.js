/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* —— AI 编程航海学院 · 航海纸质色板（映射 index.css 中的 CSS 变量）—— */
        paper: 'var(--paper)',
        'paper-deep': 'var(--paper-deep)',
        'paper-dark': 'var(--paper-dark)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-faint': 'var(--ink-faint)',
        teal: {
          DEFAULT: 'var(--teal)',
          deep: 'var(--teal-deep)',
          mist: 'var(--teal-mist)',
        },
        vermilion: {
          DEFAULT: 'var(--vermilion)',
          soft: 'var(--vermilion-soft)',
        },
        gold: 'var(--gold)',
        line: 'var(--line)',
        'code-bg': 'var(--code-bg)',
        white: 'var(--white)',
        /* 五大板块专属色 */
        cat: {
          renzhi: 'var(--cat-renzhi)',
          jichu: 'var(--cat-jichu)',
          neigong: 'var(--cat-neigong)',
          jinjie: 'var(--cat-jinjie)',
          zuixin: 'var(--cat-zuixin)',
        },
        /* shadcn/ui tokens */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Songti SC', 'serif'],
        sans: ['"Noto Sans SC"', 'PingFang SC', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Noto Serif SC"', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      maxWidth: {
        wide: '1280px',
        read: '760px',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        card: '0 2px 8px rgba(43,38,32,0.06), 0 8px 24px rgba(43,38,32,0.05)',
        lift: '0 6px 16px rgba(43,38,32,0.10), 0 16px 40px rgba(43,38,32,0.10)',
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      transitionTimingFunction: {
        voyage: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "compass-sway": {
          "0%,100%": { transform: "rotate(-8deg)" },
          "50%": { transform: "rotate(8deg)" },
        },
        "wave-drift": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float-y": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "pulse-dot": {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "anchor-sway": {
          "0%,100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "compass-sway": "compass-sway 6s ease-in-out infinite",
        "wave-drift": "wave-drift 12s linear infinite",
        "float-y": "float-y 1.8s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "spin-slow": "spin-slow 60s linear infinite",
        "anchor-sway": "anchor-sway 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
