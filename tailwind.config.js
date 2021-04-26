module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      blue: {
        light: '#b9d7ea',
        DEFAULT: '#769fcd',
        dark: '#112d4e',
      },
      earth: {
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
  plugins: [],
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