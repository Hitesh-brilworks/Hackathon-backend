# Node.js API Boilerplate

A Node.js API boilerplate with Express, MongoDB, and Swagger.

## Features

- Express.js framework
- MongoDB with Mongoose
- API documentation with Swagger
- Environment variables with dotenv
- MVC architecture

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server
```bash
npm run dev
```

## API Documentation

API documentation is available at `/api-docs` endpoint.

## Project Structure

```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── models/         # Database models
├── routes/         # API routes
├── config/         # Configuration files
├── app.js          # Express app
```

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon
- `npm test` - Run tests