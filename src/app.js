const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const db = require("./config/database");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const Port = process.env.PORT || 2000;
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files
app.use("/uploads", express.static("uploads"));

// Database connection
db.connect();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: `http://localhost:${Port}`,
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api", routes);

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(Port, () => {
  console.log(`🚀 Server running on port ${Port}`);
  console.log(`📚 API Documentation: http://localhost:${Port}/api-docs`);
});

module.exports = app;
