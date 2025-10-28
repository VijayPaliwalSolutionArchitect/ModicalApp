# ShivamModicalClinic Backend

Backend API for the ShivamModicalClinic application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration.

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check endpoint

## Dependencies

- Express v5.1.0 - Web framework
- Mongoose v8.19.2 - MongoDB ODM
- JSON Web Token v9.0.2 - Authentication
- bcryptjs v3.0.2 - Password hashing
- CORS v2.8.5 - Cross-Origin Resource Sharing
- dotenv v17.2.3 - Environment variables
