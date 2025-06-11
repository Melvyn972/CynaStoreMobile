# CynaStore Mobile App

A React Native mobile application built with Expo that connects to the CynaStore web API.

## Features

- **Authentication**: User login, registration, and secure token-based authentication
- **Article Browsing**: View and search articles from the web app
- **Shopping Cart**: Add items to cart, manage quantities, and checkout
- **User Profile**: Manage user account and settings
- **Modern UI**: Clean, responsive design with native navigation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS development) or Android Studio (for Android development)

## Installation

1. Navigate to the mobile app directory:
   ```bash
   cd CynaStoreMobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API URL in `.env`:
   ```
   API_URL=http://localhost:3000/api
   NEXTAUTH_URL=http://localhost:3000
   ```

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

### Platform-Specific Commands

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

For Web:
```bash
npm run web
```

## Project Structure

```
src/
├── config/          # API configuration
├── context/         # React Context providers
├── navigation/      # Navigation configuration
├── screens/         # Screen components
├── services/        # API service functions
└── utils/          # Utility functions
```

## API Integration

The mobile app connects to the web app's API endpoints:

- **Authentication**: `/api/auth/*`
- **Articles**: `/api/articles/*`
- **Cart**: `/api/cart/*`
- **User**: `/api/user/*`

## Key Components

### Authentication
- Login/Register screens with validation
- Secure token storage using AsyncStorage
- Automatic token refresh and logout on expiry

### Navigation
- Tab-based navigation for main screens
- Stack navigation for detailed views
- Authentication flow handling

### Data Management
- Axios-based HTTP client with interceptors
- React Context for global state management
- Async storage for persistent data

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
API_URL=http://your-api-url/api
NEXTAUTH_URL=http://your-web-app-url
```

### API URL Configuration
For development, ensure your web app is running and accessible. The default configuration assumes:
- Web app running on `http://localhost:3000`
- API accessible at `http://localhost:3000/api`

## Building for Production

### Build for iOS
```bash
npm run build:ios
```

### Build for Android
```bash
npm run build:android
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npm start -- --clear`
2. **iOS simulator issues**: Reset simulator or restart Xcode
3. **Android issues**: Ensure Android Studio and emulator are properly configured
4. **API connection issues**: Check network configuration and API URL

### Network Configuration

For testing on physical devices, update the API_URL to use your computer's IP address instead of localhost:
```env
API_URL=http://192.168.1.100:3000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 