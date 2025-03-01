# Pre-Deployment Checklist

## Frontend

- [ ] **Code Quality**

  - [ ] Run linting checks and fix issues
  - [ ] Remove all console.log statements (or make conditional)
  - [ ] Check for unused imports and variables
  - [ ] Ensure proper error handling throughout

- [ ] **Performance**

  - [ ] Optimize image sizes
  - [ ] Implement lazy loading for routes
  - [ ] Check bundle size and optimize if needed
  - [ ] Verify efficient re-rendering (no unnecessary renders)

- [ ] **Environment**

  - [ ] Update API base URL for production
  - [ ] Set environment variables for production build
  - [ ] Create production build and test locally

- [ ] **Testing**

  - [ ] Test all user flows
  - [ ] Verify responsive design on multiple devices
  - [ ] Test with slow network connection
  - [ ] Verify all animations and transitions

- [ ] **Accessibility**
  - [ ] Check color contrast
  - [ ] Ensure keyboard navigation works
  - [ ] Add appropriate ARIA attributes
  - [ ] Test with screen reader

## Mobile (Capacitor)

- [ ] **Android Configuration**

  - [ ] Update AndroidManifest.xml for production
  - [ ] Configure app icon and splash screen
  - [ ] Test on multiple Android device sizes
  - [ ] Verify network connectivity handling

- [ ] **Mobile-Specific Features**

  - [ ] Test hardware back button behavior
  - [ ] Verify touch target sizes are appropriate
  - [ ] Check app behavior when backgrounded/resumed
  - [ ] Test offline capabilities

- [ ] **Mobile Build**
  - [ ] Update capacitor.config.json for production
  - [ ] Build Android APK
  - [ ] Test APK on physical device
  - [ ] Verify API connectivity from built app

## Backend

- [ ] **Security**

  - [ ] Update JWT secret for production
  - [ ] Set secure cookie options
  - [ ] Configure CORS for production domains only
  - [ ] Update rate limits for production
  - [ ] Ensure all routes have proper authentication

- [ ] **Database**

  - [ ] Set up production database
  - [ ] Create database indexes for performance
  - [ ] Verify connection string in environment variables
  - [ ] Set up database backups

- [ ] **Error Handling**

  - [ ] Ensure centralized error handling
  - [ ] Remove detailed error messages in production
  - [ ] Set up error logging

- [ ] **Performance**

  - [ ] Implement query optimization
  - [ ] Add caching where appropriate
  - [ ] Test with expected production load

- [ ] **Environment**
  - [ ] Set NODE_ENV to production
  - [ ] Configure all production environment variables
  - [ ] Test with production configuration

## Deployment

- [ ] **Frontend Deployment**

  - [ ] Build production version
  - [ ] Upload to S3 bucket
  - [ ] Configure S3 for static website hosting
  - [ ] Set up CloudFront (if using)
  - [ ] Test deployed frontend

- [ ] **Backend Deployment**

  - [ ] Configure Vercel project
  - [ ] Set environment variables in Vercel
  - [ ] Deploy to Vercel
  - [ ] Test deployed API endpoints

- [ ] **Domain Configuration**
  - [ ] Set up custom domain (if using)
  - [ ] Configure DNS settings
  - [ ] Set up SSL certificate
  - [ ] Test with final domain

## Post-Deployment

- [ ] **Monitoring**

  - [ ] Set up uptime monitoring
  - [ ] Configure error tracking
  - [ ] Set up performance monitoring

- [ ] **Testing**

  - [ ] Verify all functionality on production
  - [ ] Test user registration and login
  - [ ] Test core game mechanics
  - [ ] Verify data persistence
  - [ ] Test mobile app against production API

- [ ] **Documentation**
  - [ ] Update documentation with production URLs
  - [ ] Document deployment process
  - [ ] Create user guide (if needed)
  - [ ] Document mobile app setup and testing process
