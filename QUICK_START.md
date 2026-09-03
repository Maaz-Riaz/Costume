# 🚀 Quick Start Guide - CostumeMart

Get your kids' costume e-commerce store running in 10 minutes!

## 1️⃣ Run Setup Script

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

## 2️⃣ Configure Environment Variables

### Backend Setup
Edit `Backend/.env` and add:

**Required:**
- `MONGODB_URI` - Get free MongoDB at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- `JWT_SECRET` - Any random string (e.g., `my-super-secret-key-12345`)

**For Email (Gmail recommended):**
1. Enable 2FA on Google Account
2. Visit [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate App Password and paste in:
   - `SMTP_USER=your_gmail@gmail.com`
   - `SMTP_PASSWORD=xxxx xxxx xxxx xxxx` (the 16-char password)

**For Images (Optional but Recommended):**
1. Sign up at [imagekit.io](https://imagekit.io) (free tier available)
2. Get API keys from Dashboard
3. Add to `.env`:
   - `IMAGEKIT_PUBLIC_KEY`
   - `IMAGEKIT_PRIVATE_KEY`
   - `IMAGEKIT_URL_ENDPOINT`

### Frontend Setup
`Frontend/.env.local` is auto-created. No changes needed unless backend is on different URL.

## 3️⃣ Create First Admin User

Open Command Prompt/PowerShell after starting backend:

**Windows:**
```powershell
$body = @{
  email = "admin@costumemart.com"
  password = "your-password"
  role = "admin"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/admin/register" `
  -ContentType "application/json" `
  -Method POST `
  -Body $body
```

**macOS/Linux:**
```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@costumemart.com","password":"your-password","role":"admin"}'
```

## 4️⃣ Start the Application

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
Backend running at: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
Frontend running at: http://localhost:5173

## 5️⃣ Access Your App

| Page | URL | Login |
|------|-----|-------|
| 🏠 Storefront | http://localhost:5173 | Public |
| 📦 Product Catalog | http://localhost:5173/products | Public |
| 🛒 Shopping Cart | http://localhost:5173/cart | Public |
| 📝 Checkout | http://localhost:5173/checkout | Public |
| 🎭 Admin Panel | http://localhost:5173/admin/login | Email/Password |
| 📊 Dashboard | http://localhost:5173/admin | Must be logged in |

## 🎯 What You Can Do Now

✅ Add products (admin)
✅ View products (public)
✅ Add to cart
✅ Complete checkout
✅ Receive order emails
✅ Manage orders (admin)
✅ Update order status (admin)

## 🐛 Troubleshooting

**Port Already in Use?**
```bash
# Change port in Frontend/vite.config.js
# or Backend/.env PORT variable
```

**MongoDB Connection Error?**
- Ensure MongoDB is running (if local): `mongod`
- Or create free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

**Email Not Sending?**
- Check SMTP credentials in `.env`
- Verify Gmail App Password is correct
- Check spam folder
- Enable "Less secure apps" if not using App Password (not recommended)

**Images Not Uploading?**
- ImageKit is optional - products work without images
- Upload manually or skip image setup for now

**Port 5173 Already in Use?**
Edit `Frontend/vite.config.js`:
```js
server: {
  port: 5174,  // Change to different port
}
```

## 📚 Full Documentation

See [README.md](README.md) for complete setup, API docs, and deployment guide.

## 🆘 Need Help?

1. Check README.md - Troubleshooting section
2. Review `.env.example` files for all variables
3. Check browser console (F12) for frontend errors
4. Check terminal output for backend errors

---

**You're all set! Happy coding! 🎉**
