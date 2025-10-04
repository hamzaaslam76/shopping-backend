# Vercel Deployment Guide

This guide will help you deploy your Node.js backend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Files Created for Vercel

The following files have been created/modified for Vercel deployment:

- `vercel.json` - Vercel configuration
- `api/index.js` - Serverless function entry point
- `.vercelignore` - Files to exclude from deployment
- Updated `package.json` with proper scripts

## Deployment Steps

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new one
   - Choose your Git repository
   - Confirm settings

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect it's a Node.js project
5. Configure environment variables (see below)
6. Click "Deploy"

## Environment Variables Setup

You need to set up the following environment variables in Vercel:

### Required Variables:
- `NODE_ENV` = `production`
- `DATABASE` = Your MongoDB connection string
- `DATABASE_PASSWORD` = Your MongoDB password
- `JWT_SECRET` = Your JWT secret key
- `JWT_EXPIRES_IN` = `90d`
- `JWT_COOKIE_EXPIRES_IN` = `90`

### Email Configuration:
- `EMAIL_USERNAME` = Your email username
- `EMAIL_PASSWORD` = Your email password
- `EMAIL_HOST` = Your SMTP host
- `EMAIL_PORT` = `587` (or your provider's port)
- `EMAIL_USER` = Your email username
- `EMAIL_PASS` = Your email password

### Application URLs:
- `BASE_URL` = `https://your-app-name.vercel.app`
- `CLIENT_URL` = Your frontend URL
- `PRODUCT_NOTIFICATION_EMAIL` = Admin email
- `ADMIN_EMAIL` = Admin email

### How to Set Environment Variables:

1. **Via Vercel CLI**:
   ```bash
   vercel env add VARIABLE_NAME
   ```

2. **Via Vercel Dashboard**:
   - Go to your project dashboard
   - Click on "Settings"
   - Click on "Environment Variables"
   - Add each variable

## Important Notes

### File Uploads
- File uploads are configured to use memory storage (not disk storage)
- For production file storage, consider using:
  - AWS S3
  - Cloudinary
  - Vercel Blob Storage

### Database
- Make sure your MongoDB Atlas cluster allows connections from Vercel's IP ranges
- Add `0.0.0.0/0` to your MongoDB Atlas network access list for Vercel

### CORS
- Update your `CLIENT_URL` environment variable to match your frontend domain
- The CORS configuration in `app.js` should work with your frontend

## Testing Your Deployment

1. After deployment, test your API endpoints:
   ```bash
   curl https://your-app-name.vercel.app/api/v1/products
   ```

2. Check the Vercel function logs for any errors:
   - Go to your project dashboard
   - Click on "Functions" tab
   - Check logs for any issues

## Troubleshooting

### Common Issues:

1. **Database Connection Issues**:
   - Check MongoDB Atlas network access settings
   - Verify connection string format
   - Ensure database password is correct

2. **Environment Variables**:
   - Make sure all required variables are set
   - Check variable names match exactly (case-sensitive)
   - Redeploy after adding new variables

3. **File Upload Issues**:
   - Remember that Vercel uses serverless functions
   - File storage is not persistent
   - Consider using external storage services

4. **CORS Issues**:
   - Update `CLIENT_URL` to match your frontend domain
   - Check CORS configuration in `app.js`

## Next Steps

1. Set up your environment variables
2. Deploy to Vercel
3. Test all API endpoints
4. Update your frontend to use the new Vercel URL
5. Consider setting up a custom domain if needed

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test locally with production environment variables
4. Check Vercel documentation for serverless function limitations
