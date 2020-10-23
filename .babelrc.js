const toKebabCase = (str) =>
  str.replace(
    /([a-z])?([A-Z])/g,
    (m, g1, g2) => (g1 ? g1 + "-" : "") + g2.toLowerCase()
  );

module.exports = {
  plugins: [
    [
      "transform-imports",
      {
        "date-fns/locale": {
          transform: (importName) =>
            `date-fns/locale/${toKebabCase(importName)}`,
          preventFullImport: true
        },
        "date-fns": {
          transform: "date-fns/${member}",
          preventFullImport: true
        },
        ramda: {
          transform: "ramda/es/${member}",
          preventFullImport: true
        },
      },
    ],
    "@babel/plugin-transform-runtime",
    "transform-class-properties"
  ],
  presets: ["@babel/env", "@babel/react", "@babel/typescript"]
};
