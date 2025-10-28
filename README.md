# ModicalApp

Modical App is a modern medical practice & patient portal that makes appointment scheduling, online/offline visits, labs and tests integration, prescription, follow-up, notification, reminders, AI augmentation, patient follow-up delightful for doctors and simple for patients. Built for mobile-first (React Native + Acentry UI + Express + MongoDB)

## Project Structure

This is a React Native project with TypeScript, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

- **Frontend**: React Native with TypeScript
- **Backend**: Express.js with MongoDB (in `/backend` directory)

### Key Technologies

**Frontend:**
- React Native 0.82.1
- TypeScript
- React Navigation
- React Native Reanimated 2
- Axios for API calls
- Async Storage for local data
- Gesture Handler for gestures

**Backend:**
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests
- dotenv for environment configuration

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/set-up-your-environment))

### Installation

1. Install frontend dependencies:
```sh
npm install
```

2. Install backend dependencies:
```sh
cd backend
npm install
```

### Running the App

#### Step 1: Start Metro Bundler

First, you will need to run **Metro**, the JavaScript build tool for React Native.

```sh
npm start
```

#### Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project.

##### Android

```sh
npm run android
```

##### iOS

For iOS, remember to install CocoaPods dependencies first:

```sh
# Install Ruby bundler (first time only)
bundle install

# Install CocoaPods dependencies
cd ios
bundle exec pod install
cd ..

# Run the app
npm run ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

### Development

- **Lint**: `npm run lint`
- **Test**: `npm test`
- **Start Metro**: `npm start`

### Backend Setup

The backend is located in the `/backend` directory. To run the backend server, you'll need to:

1. Configure your MongoDB connection in a `.env` file
2. Start the Express server (configuration to be added)

## Modifying the App

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

## Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started) - navigation library
- [Express.js Documentation](https://expressjs.com/) - backend framework
- [MongoDB Documentation](https://docs.mongodb.com/) - database

## Troubleshooting

If you're having issues getting the above steps to work, see the [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.
