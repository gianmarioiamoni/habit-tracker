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
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(process.cwd(), "/routes/*.js")], // path to endpoints files to be documented
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
