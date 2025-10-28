# ModicalApp

Modical App is a modern medical practice & patient portal that makes appointment scheduling, online/offline visits, labs and tests integration, prescription, follow-up, notification, reminders, AI augmentation, patient follow-up delightful for doctors and simple for patients. Built for mobile-first (React Native + Acentry UI + Express + MongoDB)

## Project Structure

```
ModicalApp/
├── ShivamModicalClinic/    # React Native mobile application
│   ├── android/             # Android native code
│   ├── ios/                 # iOS native code
│   ├── App.tsx             # Main application component
│   └── package.json        # Frontend dependencies
├── backend/                 # Express.js backend API
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
└── README.md               # This file
```

## Technologies

### Frontend (ShivamModicalClinic)
- **React Native 0.82.1** - Mobile application framework
- **TypeScript 5.8.3** - Type-safe JavaScript
- **React Navigation 7.1.19** - Navigation library
- **React Native Reanimated 4.1.3** - Animations library
- **Axios 1.13.0** - HTTP client
- **Async Storage 2.2.0** - Local storage
- **Gesture Handler 2.29.0** - Touch gestures

### Backend
- **Express 5.1.0** - Web framework
- **Mongoose 8.19.2** - MongoDB ODM
- **JSON Web Token 9.0.2** - Authentication
- **bcryptjs 3.0.2** - Password hashing
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 17.2.3** - Environment variables

## Getting Started

### Prerequisites
- Node.js >= 20
- npm or yarn
- React Native development environment (Android Studio / Xcode)
- MongoDB (for backend)

### Frontend Setup

1. Navigate to the React Native project:
```bash
cd ShivamModicalClinic
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start Metro bundler:
```bash
npm start
```

4. Run on Android:
```bash
npm run android
```

5. Run on iOS:
```bash
npm run ios
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Start the server:
```bash
npm start
```

## Development

### Running Tests

Frontend tests:
```bash
cd ShivamModicalClinic
npm test
```

### Linting

Frontend linting:
```bash
cd ShivamModicalClinic
npm run lint
```

## License

ISC

