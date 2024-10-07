import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Habit Tracker API", // API title
    version: "1.0.0", // version
    description: "API documentation for the Habit Tracker app", // description
  },
  servers: [
    {
      url: process.env.SERVER_URL || "http://localhost:5000",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Habit: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "614c1b7e4f1a5c001f4d84d8",
          },
          title: {
            type: "string",
            example: "Read a book",
          },
          description: {
            type: "string",
            example: "Read 10 pages of a book daily",
          },
          frequency: {
            type: "string",
            example: "daily",
          },
          user: {
            type: "string",
            description: "ID of the user who owns the habit",
            example: "614c1b7e4f1a5c001f4d84d8",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2021-09-23T08:27:34.661Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2021-09-23T08:27:34.661Z",
          },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

///////////////

// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Habit Tracker API",
//       version: "1.0.0",
//       description: "API documentation for the Habit Tracker app",
//     },
//     servers: [
//       {
//         url: "http://localhost:5000",
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//       schemas: {
//         Habit: {
//           type: "object",
//           properties: {
//             _id: {
//               type: "string",
//               example: "614c1b7e4f1a5c001f4d84d8",
//             },
//             title: {
//               type: "string",
//               example: "Read a book",
//             },
//             description: {
//               type: "string",
//               example: "Read 10 pages of a book daily",
//             },
//             frequency: {
//               type: "string",
//               example: "daily",
//             },
//             user: {
//               type: "string",
//               description: "ID of the user who owns the habit",
//               example: "614c1b7e4f1a5c001f4d84d8",
//             },
//             createdAt: {
//               type: "string",
//               format: "date-time",
//               example: "2021-09-23T08:27:34.661Z",
//             },
//             updatedAt: {
//               type: "string",
//               format: "date-time",
//               example: "2021-09-23T08:27:34.661Z",
//             },
//           },
//         },
//       },
//     },
//     security: [
//       {
//         bearerAuth: [],
//       },
//     ],
//   },
//   // apis: [path.join(process.cwd(), "/routes/*.js")], // Path to your routes or files with Swagger comments
//   apis: [
//     "/Users/gianmarioiamoni/PROGRAMMAZIONE/Projects/habit-tracker/backend/src/routes/*.js",
//   ], // Path to your routes or files with Swagger comments
// };

const options = {
  swaggerDefinition,
  // apis: [path.join(process.cwd(), "/routes/*.js")], // path to endpoints files to be documented
  apis: [
    "/Users/gianmarioiamoni/PROGRAMMAZIONE/Projects/habit-tracker/backend/src/routes/*.js",
  ], // path to endpoints files to be documented
};

// const swaggerSpec = swaggerJSDoc(swaggerOptions);
const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
