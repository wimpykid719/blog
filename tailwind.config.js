const plugin = require("tailwindcss/plugin");

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: {
        DEFAULT: 'transparent'
      },
      blue: {
        light: '#b9d7ea',
        DEFAULT: '#769fcd',
        dark: '#112d4e',
        darker: '#4471a2',
      },
      earth: {
        lighter: '#efefef',
        light: '#f9f7f7',
        DEFAULT: '#BDBDBD',
        dark: '#757575',
      },
      gray: {
        dark: '#212121',
        DEFAULT: '#d6e6f2',
        light: '#f7fbfc'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".disable-scrollbars": {
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
            display: "none"
          },
          "& *::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
            display: "none"
          },
          "& *": {
            scrollbarWidth: "none",
            "-ms-overflow-style": "none"
          }
        }
      };
      addUtilities(newUtilities);
    })
  ],
}



// module.exports = {
//   theme: {
//     colors: {
//       transparent: 'transparent',
//       current: 'currentColor',
//       blue: {
//         light: '#b9d7ea',
//         DEFAULT: '#769fcd',
//         dark: '#112d4e',
//       },
//       earth: {
//         light: '#f9f7f7',
//         DEFAULT: '#BDBDBD',
//         dark: '#757575',
//       },
//       gray: {
//         dark: '#212121',
//         DEFAULT: '#d6e6f2',
//         light: '#f7fbfc'
//       }
//     }
//   }
// }