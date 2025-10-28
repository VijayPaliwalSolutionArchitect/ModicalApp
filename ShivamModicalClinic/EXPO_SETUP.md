# ShivamModicalClinic - Expo Setup Guide

## ✅ What Changed - CLI to Expo Conversion

Your React Native CLI app has been successfully converted to work with **Expo Go**!

### 🔄 Key Changes Made:

1. **Dependencies Updated:**
   - ❌ Removed: `react-native-vector-icons` 
   - ✅ Added: `@expo/vector-icons`
   - ❌ Removed: `react-native-linear-gradient`
   - ✅ Added: `expo-linear-gradient`
   - ✅ Added: Expo SDK and core modules

2. **Configuration Files:**
   - ✅ Added `app.json` - Expo configuration
   - ✅ Updated `babel.config.js` - Expo preset
   - ✅ Updated `package.json` - Expo scripts
   - ✅ Created `index.js` - Expo entry point

3. **Code Updates:**
   - ✅ All `Icon` imports changed to `Ionicons` from `@expo/vector-icons`
   - ✅ All `LinearGradient` imports changed to use `expo-linear-gradient`
   - ✅ API config updated with better Expo networking support

## 🚀 How to Run with Expo Go

### Step 1: Install Expo Go App
- **Android:** [Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS:** [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### Step 2: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# or
hostname -I
```

### Step 3: Update API Configuration

Edit `/app/ShivamModicalClinic/src/config/api.js`:

```javascript
const LOCAL_IP = '192.168.1.100'; // Replace with YOUR IP
```

**Important:** Your phone and computer must be on the **same WiFi network**!

### Step 4: Ensure Backend is Running

```bash
cd /app/backend
npm start
```

Verify it's accessible:
```bash
curl http://localhost:5000/health
```

### Step 5: Start Expo Dev Server

```bash
cd /app/ShivamModicalClinic
npm start
```

You'll see a QR code in the terminal.

### Step 6: Open in Expo Go

**Android:**
1. Open Expo Go app
2. Tap "Scan QR code"
3. Scan the QR code from your terminal

**iOS:**
1. Open Camera app
2. Point at QR code
3. Tap the notification to open in Expo Go

## 📱 Quick Start Commands

```bash
# Start development server
npm start

# Start with specific platform
npm run android  # Opens Android emulator
npm run ios      # Opens iOS simulator
npm run web      # Opens in web browser

# Clear cache and restart
npm start -- --clear
```

## 🔧 Troubleshooting

### Issue: "Network response timed out"

**Solution:**
1. Make sure your phone and computer are on the same WiFi
2. Check firewall isn't blocking port 5000
3. Update the IP address in `src/config/api.js`
4. Restart backend server

### Issue: "Unable to resolve module"

**Solution:**
```bash
# Clear cache
npm start -- --clear

# Or reinstall
rm -rf node_modules
npm install
```

### Issue: QR Code not scanning

**Solution:**
- Make sure you're using the latest Expo Go app
- Try typing the URL manually in Expo Go
- Use tunnel mode: `npm start -- --tunnel`

### Issue: "Expo Go is not compatible"

**Solution:**
```bash
# Update Expo to latest
npx expo install expo@latest
```

## 🎯 Testing the App

### Test Credentials:

**Patient Account:**
- Email: `patient1@example.com`
- Password: `Patient@123`

**Doctor Account:**
- Email: `dr.ajay@shivamclinic.com`
- Password: `Doctor@123`

### Quick Login:
The login screen has "Quick Login" buttons to auto-fill credentials for testing.

## 📊 What Works Now:

✅ Authentication (Login/Register)
✅ Patient Dashboard
✅ Doctor Dashboard (basic)
✅ API calls to backend
✅ Beautiful UI with gradients
✅ Smooth navigation
✅ All Expo Go compatible

## 🎨 Customization

### Change App Name:
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your Clinic Name",
    "slug": "your-clinic-slug"
  }
}
```

### Add Icons:
Place these in `/assets/` folder:
- `icon.png` (1024x1024) - App icon
- `splash.png` (1242x2436) - Splash screen
- `adaptive-icon.png` (1024x1024) - Android icon

Generate icons at: https://www.appicon.co/

### Change Colors:
Edit `src/config/theme.js`:
```javascript
export const COLORS = {
  primary: '#007FFF',  // Your brand color
  accent: '#26C281',   // Secondary color
  // ...
};
```

## 🌐 Network Configuration Details

### For Physical Device:
```javascript
// In src/config/api.js
const LOCAL_IP = '192.168.1.100'; // Your computer's IP
```

### For Android Emulator:
```javascript
const LOCAL_IP = 'localhost'; // Uses 10.0.2.2 automatically
```

### For iOS Simulator:
```javascript
const LOCAL_IP = 'localhost'; // Works directly
```

## 📦 Building Standalone App (Optional)

When ready for production:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 🔍 Debug Tools

### View Console Logs:
```bash
# In Expo Go, shake device and tap "Show Dev Menu"
# Then select "Debug Remote JS"
```

### Network Debugging:
```bash
# Check API calls
console.log('API Base URL:', API_BASE_URL);
```

### Check Expo Diagnostics:
```bash
npx expo-doctor
```

## 📱 Differences from CLI Version

| Feature | CLI Version | Expo Version |
|---------|-------------|--------------|
| Icons | react-native-vector-icons | @expo/vector-icons |
| Gradients | react-native-linear-gradient | expo-linear-gradient |
| Testing | Requires build | Instant with Expo Go |
| Debugging | Complex setup | Built-in tools |
| Updates | Requires rebuild | OTA updates |

## 🎯 Next Steps

1. ✅ Test login on your phone
2. ✅ Verify API connectivity  
3. ✅ Add custom app icons
4. 📅 Implement remaining features
5. 🚀 Build standalone app

## 💡 Pro Tips

1. **Use Tunnel Mode for Remote Testing:**
   ```bash
   npm start -- --tunnel
   ```

2. **Hot Reload:** Changes appear instantly in Expo Go

3. **Fast Refresh:** Saves app state during development

4. **Multiple Devices:** Scan same QR on multiple devices

5. **Share with Team:** Share Expo link for testing

## 📞 Support

**Backend Issues:**
- Check logs: `tail -f /var/log/backend.log`
- Test health: `curl http://localhost:5000/health`

**Frontend Issues:**
- Clear cache: `npm start -- --clear`
- Check Expo status: https://status.expo.dev/

## 🎉 You're All Set!

Your app is now Expo-compatible and ready to test on any device with Expo Go!

Simply:
1. Update your IP in `src/config/api.js`
2. Run `npm start`
3. Scan QR code
4. Test away! 🚀

---

**Happy Coding! 💙**
