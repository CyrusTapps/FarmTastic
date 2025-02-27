# Deployment Strategy

## Hosting Infrastructure

### Frontend

- **Platform**: AWS S3 (static hosting)
- **Distribution**: Amazon CloudFront (optional)
- **Domain**: Custom domain via Route 53 (planned)
- **Build Process**: Vite production build

### Backend

- **Platform**: Vercel
- **Type**: Serverless functions
- **Region**: US East (or closest to target audience)
- **Scaling**: Automatic via Vercel

### Database

- **Platform**: MongoDB Atlas
- **Tier**: M0 Free Tier (initially)
- **Scaling**: Upgrade as needed based on usage
- **Backup**: Automated daily backups

## Environment Configuration

### Development Environment

- Local MongoDB instance
- Local Express server
- Vite dev server with hot reloading
- Extended JWT expiration times
- Increased rate limits
- Detailed error messages and logging

### Production Environment

- MongoDB Atlas
- Vercel serverless functions
- Static files on AWS S3
- Shorter JWT expiration times
- Stricter rate limits
- Generic error messages
- Minimal logging

## Deployment Process

### Frontend Deployment

1. Run `npm run build` to generate production build
2. Upload build files to S3 bucket
3. Configure S3 for static website hosting
4. Set up CloudFront distribution (optional)
5. Point domain to S3/CloudFront (if using custom domain)

### Backend Deployment

1. Connect Vercel to GitHub repository
2. Configure environment variables in Vercel dashboard
3. Set up MongoDB Atlas connection string
4. Deploy to Vercel
5. Configure custom domain (if applicable)

## Environment Variables

### Frontend (.env.production)

VITE_API_URL=https://your-production-api.com/api
VITE_ENV=production

### Backend (.env.production)

NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/farmtastic
JWT_SECRET=your-strong-jwt-secret
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=3d
CLIENT_URL=https://your-frontend-domain.com

## Database Preparation

1. **MongoDB Connection**:

   - Update MONGO_URI to production MongoDB Atlas instance
   - Add appropriate indexes for frequently queried fields
   - Set up database user with appropriate permissions

2. **Initial Data**:
   - Prepare seed data for production if needed
   - Create admin user if applicable

## CORS Configuration

- Update CORS settings to allow only production frontend URL
- Verify CORS is properly configured for production domains

## Build Configuration

- Review and optimize Vite build settings for production
- Enable additional optimizations like code splitting
- Configure proper caching headers for static assets
