# 🚀 Quick Start - Testing on Your Phone with Expo Go

## 1️⃣ Install Expo Go (One-time setup)

**On Your Phone:**
- Android: Search "Expo Go" in Play Store → Install
- iOS: Search "Expo Go" in App Store → Install

## 2️⃣ Find Your Computer's IP Address

**Run this command on your computer:**

```bash
# For macOS/Linux
hostname -I | awk '{print $1}'

# For Windows (in PowerShell)
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"}).IPAddress
```

**Example output:** `192.168.1.100` ← This is YOUR IP

## 3️⃣ Update API Configuration

**Edit this file:** `/app/ShivamModicalClinic/src/config/api.js`

**Find this line (around line 18):**
```javascript
const LOCAL_IP = 'localhost'; // Change to your IP: e.g., '192.168.1.100'
```

**Change to YOUR IP:**
```javascript
const LOCAL_IP = '192.168.1.100'; // ← Your actual IP here
```

**Save the file!**

## 4️⃣ Make Sure Backend is Running

```bash
cd /app/backend
npm start
```

You should see: `🚀 Server is running on port 5000`

## 5️⃣ Start Expo Dev Server

**Open a NEW terminal:**
```bash
cd /app/ShivamModicalClinic
npm start
```

You'll see:
- A QR code
- A URL like: `exp://192.168.1.100:8081`

## 6️⃣ Open on Your Phone

**Make sure your phone is on the SAME WiFi as your computer!**

**Android:**
1. Open Expo Go app
2. Tap "Scan QR code"
3. Point camera at QR code in terminal
4. Wait for app to load

**iOS:**
1. Open Camera app (not Expo Go)
2. Point at QR code
3. Tap notification "Open in Expo Go"
4. Wait for app to load

## 7️⃣ Test Login

**Quick test buttons on login screen:**
- Tap "Login as Patient"
- Or manually enter:
  - Email: `patient1@example.com`
  - Password: `Patient@123`

## ✅ Success!

You should see the Patient Dashboard! 🎉

---

## 🐛 Troubleshooting

### "Network request failed"

**Problem:** Phone can't reach backend

**Solution:**
1. Check both devices on same WiFi
2. Verify IP is correct in `src/config/api.js`
3. Test backend: `curl http://YOUR_IP:5000/health`
4. Check firewall isn't blocking port 5000

### "Unable to connect to Metro"

**Problem:** Expo server not reachable

**Solution:**
1. Both devices on same WiFi?
2. Try tunnel mode: `npm start -- --tunnel`
3. Or type URL manually in Expo Go

### "Something went wrong"

**Solution:**
```bash
# Clear cache and restart
npm start -- --clear
```

---

## 🎯 Quick Commands

```bash
# Start dev server
npm start

# Clear cache
npm start -- --clear

# Use tunnel (slower but works with any network)
npm start -- --tunnel

# Android emulator
npm run android

# iOS simulator  
npm run ios
```

## 📝 Test Accounts

**Patient:**
- Email: patient1@example.com
- Password: Patient@123

**Doctor:**
- Email: dr.ajay@shivamclinic.com
- Password: Doctor@123

---

**Need help? Check `/app/ShivamModicalClinic/EXPO_SETUP.md` for detailed guide.**
