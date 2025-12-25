# Ghuumo 🏡  
A full-stack Airbnb-style property rental platform

🔗 Live Demo: https://ghuumo.suvayu.me  |  https://ghuumo.onrender.com
📦 GitHub: https://github.com/SuvayuBiswas/ghuumo  

---

## ✨ Features

- User authentication & authorization (Passport.js)
- Create, edit & delete property listings
- Secure image uploads using Cloudinary
- Category-based listing filters (Beach, Mountain, Apartment, Room)
- Location search with auto-suggest (OpenStreetMap – Nominatim API)
- Responsive UI (desktop + mobile)
- Session handling with MongoDB Atlas
- Flash messages for user feedback

---

## 🛠 Tech Stack

**Frontend**
- EJS
- Bootstrap
- Custom CSS

**Backend**
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose

**Authentication & Security**
- Passport.js
- express-session
- connect-mongo
- Helmet
- Rate Limiting

**Media & APIs**
- Cloudinary
- OpenStreetMap (Nominatim)

---

## 📸 Screenshots

### Home Page – Browse Listings
![Home Page](screenshots/listings.png)
Clean, responsive landing page with category filters and search.

### Listing Details – Reviews & Map
![Listing Details](screenshots/map.png)
Detailed listing view with user reviews and interactive map.

### User Authentication
![Signup](screenshots/signup.png)
Secure sign-up and login using Passport.js.

---

## 🧱 Architecture

- MVC pattern
- RESTful routes
- Server-side rendering (EJS)
- Secure session-based authentication

---

## 🚀 Getting Started (Local Setup)

```bash
git clone https://github.com/SuvayuBiswas/ghuumo.git
cd ghuumo
npm install
