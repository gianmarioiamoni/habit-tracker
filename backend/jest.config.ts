module.exports = {
  preset: "ts-jest", // Usa ts-jest per trasformare i file TypeScript
  testEnvironment: "node",
  testTimeout: 10000,
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Trasforma i file .ts e .tsx con ts-jest
  },
  globals: {
    "ts-jest": {
      isolatedModules: true, // Facoltativo, può migliorare le performance durante i test
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js"], // Supporta estensioni .ts, .tsx e .js
  transformIgnorePatterns: ["/node_modules/"], // Ignora la trasformazione dei moduli di node_modules
};
