# 🎭 CostumeMart - Kids' Costume E-Commerce Platform

A full-stack MERN e-commerce web application for a kids' costume store, featuring a customer-facing storefront, checkout system with email notifications, and an admin CMS for product management.

## 📋 Project Overview

**Tech Stack:**
- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Database:** MongoDB
- **Image Hosting:** ImageKit (with Multer for uploads)
- **Email:** Nodemailer
- **Form Validation:** React Hook Form + Zod
- **State Management:** Zustand
- **Notifications:** React Hot Toast

## 📁 Project Structure

```
Costume/
├── Backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Admin.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── auth.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── imagekit.js
│   │   └── nodemailer.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   └── auth.js
│   │   ├── store/
│   │   │   ├── cartStore.js
│   │   │   └── authStore.js
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductFormModal.jsx
│   │   │   └── OrderDetailModal.jsx
│   │   ├── pages/
│   │   │   ├── customer/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── ProductsPage.jsx
│   │   │   │   ├── ProductDetailPage.jsx
│   │   │   │   ├── CartPage.jsx
│   │   │   │   ├── CheckoutPage.jsx
│   │   │   │   └── OrderConfirmationPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLoginPage.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ProductManagementPage.jsx
│   │   │       └── OrderManagementPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- ImageKit account (for image uploads)
- Email service (Gmail App Password, SendGrid, or similar)

### Backend Setup

1. **Navigate to Backend folder:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` file:**
   ```
   MONGODB_URI=mongodb://localhost:27017/costume-store
   JWT_SECRET=your_super_secret_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   
   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   
   # Email (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ADMIN_EMAIL=admin@costumemart.com
   
   FRONTEND_URL=http://localhost:5173
   ```

   **How to get Gmail App Password:**
   1. Enable 2FA on your Google Account
   2. Go to https://myaccount.google.com/apppasswords
   3. Generate an app password for Mail

5. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

7. **Create initial admin user** (POST to `/api/admin/register`):
   ```bash
   curl -X POST http://localhost:5000/api/admin/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@costumemart.com",
       "password": "yourpassword",
       "role": "admin"
     }'
   ```

### Frontend Setup

1. **Navigate to Frontend folder:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🎯 Features

### Customer Storefront
- ✅ Hero banner with featured costumes
- ✅ Product catalog with filtering (category, price, age range)
- ✅ Search functionality
- ✅ Product detail pages with image gallery
- ✅ Shopping cart with persistent storage
- ✅ Checkout with form validation
- ✅ Order confirmation with reference number
- ✅ Responsive mobile-first design
- ✅ Bright, playful UI using Tailwind CSS

### Order System
- ✅ Form-based checkout (no payment gateway)
- ✅ Email notifications to admin on new orders
- ✅ Optional email confirmation to customer
- ✅ Order status tracking
- ✅ Order notes/special instructions

### Admin CMS
- ✅ Secure login with JWT authentication
- ✅ Dashboard with order and product stats
- ✅ Product management (CRUD operations)
- ✅ Multi-image upload with ImageKit integration
- ✅ Mark products as featured
- ✅ Order management with status updates
- ✅ Order detail view and printing

### Security Features
- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ CORS protection
- ✅ Rate limiting on order endpoint
- ✅ Input validation and sanitization
- ✅ Environment variables for sensitive data

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Products Endpoints

**GET /products** - Get all products with filters
```
Query params: category, priceMin, priceMax, ageRange, search
```

**GET /products/featured** - Get featured products

**GET /products/:id** - Get single product

**POST /products** - Create product (admin)
```
Headers: Authorization: Bearer {token}
Body: FormData (multipart/form-data)
```

**PUT /products/:id** - Update product (admin)

**DELETE /products/:id** - Delete product (admin)

**PATCH /products/:id/toggle-featured** - Toggle featured status

### Orders Endpoints

**POST /orders** - Create new order
```
Body: {
  customerName, email, phone,
  shippingAddress: {street, city, state, zip},
  items: [{productId, name, size, quantity, price}],
  totalAmount, notes
}
```

**GET /orders** - Get all orders (admin, with status filter)

**GET /orders/:id** - Get single order (admin)

**PATCH /orders/:id/status** - Update order status (admin)

**GET /orders/stats/overview** - Get order statistics (admin)

### Admin Endpoints

**POST /admin/login** - Login to admin panel
```
Body: {email, password}
```

**POST /admin/register** - Register new admin

**GET /admin/me** - Get current admin info

## 🎨 Customization

### Color Scheme
Edit `Frontend/tailwind.config.js`:
```js
colors: {
  primary: '#FF6B9D',    // Pink
  secondary: '#FFA500',  // Orange
  accent: '#4ECDC4',     // Teal
  light: '#F7F7F7',      // Light gray
  dark: '#333333'        // Dark gray
}
```

### Categories
Edit category arrays in:
- `Backend/models/Product.js`
- `Frontend/pages/customer/ProductsPage.jsx`
- `Frontend/pages/customer/HomePage.jsx`

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Try connection string: `mongodb://localhost:27017/costume-store`

### ImageKit Upload Fails
- Verify ImageKit credentials in .env
- Check ImageKit dashboard for API key setup
- Ensure file size is under 5MB

### Email Not Sending
- Check SMTP credentials in .env
- Enable "Less secure app access" if using Gmail (not recommended)
- Use Google App Password instead (recommended)
- Check spam folder
- Test with a simple curl request to the /api/orders endpoint

### CORS Errors
- Ensure FRONTEND_URL in backend .env matches frontend URL
- Check that server is running on correct port
- Clear browser cache and cookies

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Delete stored token: `localStorage.removeItem('adminToken')`
- Re-login to admin panel

## 📦 Production Deployment

### Backend (Render/Heroku)
1. Create MongoDB Atlas cluster
2. Update MONGODB_URI with production URL
3. Change JWT_SECRET to strong random string
4. Set NODE_ENV=production
5. Deploy using git push or platform CLI

### Frontend (Vercel/Netlify)
1. Update VITE_API_URL to production backend URL
2. Build: `npm run build`
3. Deploy build folder
4. Set environment variables in platform settings

## 📝 Environment Variables Reference

**Backend (.env):**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing key
- `JWT_EXPIRE` - Token expiration (default: 7d)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- `IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint
- `SMTP_HOST` - Email server host
- `SMTP_PORT` - Email server port
- `SMTP_USER` - Email username
- `SMTP_PASSWORD` - Email app password
- `ADMIN_EMAIL` - Admin email for notifications
- `FRONTEND_URL` - Frontend URL for CORS

**Frontend (.env.local):**
- `VITE_API_URL` - Backend API base URL

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and structure.

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Getting Help

- Check the troubleshooting section above
- Review API responses for error messages
- Check browser console for client-side errors
- Check server logs for backend errors
- Ensure all environment variables are correctly set

---

**Made with 🎨 for fun!** Happy costume shopping! 🎭
