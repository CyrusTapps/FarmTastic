**MERN Stack Authentication - Big Picture Notes**

### 1️⃣ JWT & Cookie Strategy

- **Access Token**: Short-lived (~15-30 min), stored in memory, sent in `Authorization` header.
- **Refresh Token**: Stored in an **HttpOnly** cookie, longer lifespan (days/weeks).
- **Refresh Token Route**: `/api/auth/refresh` to issue new access token when expired.
- **Security**: Set `httpOnly: true` and `secure: true` in production.

---

### 2️⃣ Security Best Practices

✔ **Password Hashing**: Use `bcrypt.hash(password, saltRounds)` (min 10 salt rounds).
✔ **Helmet for Security Headers**: Protects against XSS, clickjacking, etc.
✔ **Rate Limiting** (`express-rate-limit`):

```javascript
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts
  message: "Too many login attempts. Try again later.",
});
app.use("/api/auth/login", authLimiter);
```

✔ **CORS Settings**:

```javascript
const cors = require("cors");
app.use(cors({ origin: "https://your-cloudfront-url.com", credentials: true }));
```

---

### 3️⃣ Project Structure Example

```
/server
│── /config          # Database connection, environment variables
│── /controllers     # Business logic (e.g., authController.js)
│── /middleware      # Auth checks, error handlers
│── /models          # Mongoose schemas (User.js)
│── /routes          # Express routes (authRoutes.js)
│── /utils           # Helpers (JWT functions, email sending, etc.)
│── server.js        # Main entry point
```

---

### 4️⃣ Deployment & DevOps Considerations

- **Environment Variables (`.env`)**: Use `dotenv`, never hardcode secrets.
- **Logging & Monitoring**: Use `winston` or `morgan` for logs, consider error tracking tools (Sentry, LogRocket).

---

### 5️⃣ Authentication Flow

1. **User Registration** → Hash password → Store in DB.
2. **User Login** → Check password → Issue **JWT** + **Set refresh token cookie**.
3. **Frontend Stores Access Token in Memory**.
4. **API Calls** → Send **JWT in headers** (`Authorization: Bearer <token>`).
5. **Token Expired?** → Use **refresh token** to get a new one.
6. **Logout** → Clear refresh token cookie.

---

### 🔹 Next Steps / Considerations

- **Implementing refresh token logic?**
- **Role-based access control (RBAC)?**
- **Debugging CORS & cookie issues between AWS (CloudFront) & Vercel?**
