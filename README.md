# Admin Dashboard

Admin dashboard for FitLife application with Clerk authentication and MongoDB backend integration.

## Features

- 🔐 Clerk Authentication (Admin-only access)
- 📊 Dashboard with statistics and analytics
- 👥 User management
- 💳 Payment tracking
- 📧 Message inbox
- 📬 Newsletter subscriber management

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api  # For local development
# VITE_API_BASE_URL=https://your-main-site.vercel.app/api  # For production
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Set the **Root Directory** to `admin-dashboard`
5. Configure Environment Variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `VITE_API_BASE_URL`: Your main site's API URL (e.g., `https://yoursite.vercel.app/api`)
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Navigate to the admin-dashboard directory:

```bash
cd admin-dashboard
```

3. Deploy:

```bash
vercel
```

4. Follow the prompts and set environment variables when asked

### Setting Environment Variables in Vercel

After deployment, you can add/update environment variables:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the required variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_BASE_URL`
4. Redeploy for changes to take effect

## Admin Access

Only users with admin privileges can access this dashboard. Admin status is managed through:

1. Default admin email: `sahnawashussain98@gmail.com`
2. Additional admins can be promoted via the Users page

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router
