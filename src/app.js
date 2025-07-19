const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const db = require("./config/database");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

const Port = process.env.PORT || 2000;

// Initialize express app
const app = express();

// CORS configuration - Allow all origins
const corsOptions = {
  origin: "*", // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

app.use(cors(corsOptions));

// Body parsing middleware
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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional: for display purposes only
        },
      },
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
