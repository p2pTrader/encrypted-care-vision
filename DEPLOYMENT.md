# Vercel Deployment Guide for Encrypted Care Vision

This guide provides step-by-step instructions for deploying the Encrypted Care Vision application to Vercel.

## Prerequisites

- GitHub account with access to the `p2pTrader/encrypted-care-vision` repository
- Vercel account (free tier available)
- Node.js 18+ installed locally (for testing)

## Step-by-Step Deployment Instructions

### 1. Prepare Your Vercel Account

1. **Sign up for Vercel** (if you don't have an account):
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" and choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub account

2. **Verify your account**:
   - Check your email for verification link
   - Complete the verification process

### 2. Connect GitHub Repository

1. **Import Project**:
   - In your Vercel dashboard, click "New Project"
   - Select "Import Git Repository"
   - Find and select `p2pTrader/encrypted-care-vision`
   - Click "Import"

2. **Configure Project Settings**:
   - **Project Name**: `encrypted-care-vision` (or your preferred name)
   - **Framework Preset**: Select "Vite"
   - **Root Directory**: Leave as default (`.`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

#### Required Environment Variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

#### Optional Environment Variables:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

#### How to Add Environment Variables:

1. In your Vercel project dashboard, go to "Settings"
2. Click on "Environment Variables" in the left sidebar
3. Click "Add New"
4. For each variable:
   - **Name**: Enter the variable name (e.g., `NEXT_PUBLIC_CHAIN_ID`)
   - **Value**: Enter the variable value (e.g., `11155111`)
   - **Environment**: Select "Production", "Preview", and "Development"
   - Click "Save"

### 4. Deploy the Application

1. **Initial Deployment**:
   - After configuring all settings, click "Deploy"
   - Vercel will automatically build and deploy your application
   - Wait for the deployment to complete (usually 2-5 minutes)

2. **Monitor Deployment**:
   - Watch the build logs for any errors
   - If there are errors, check the logs and fix issues in your code
   - Redeploy if necessary

### 5. Configure Custom Domain (Optional)

1. **Add Domain**:
   - In your Vercel project dashboard, go to "Settings"
   - Click on "Domains" in the left sidebar
   - Click "Add Domain"
   - Enter your custom domain (e.g., `encryptedcarevision.com`)

2. **Configure DNS**:
   - Follow Vercel's DNS configuration instructions
   - Add the required DNS records to your domain provider
   - Wait for DNS propagation (up to 24 hours)

### 6. Set Up Automatic Deployments

1. **Enable Auto-Deploy**:
   - In your Vercel project settings, ensure "Auto-Deploy" is enabled
   - This will automatically deploy when you push to the main branch

2. **Configure Branch Settings**:
   - **Production Branch**: `main`
   - **Preview Branches**: All other branches (optional)

### 7. Test Your Deployment

1. **Access Your Application**:
   - Your application will be available at: `https://your-project-name.vercel.app`
   - Test all major functionality:
     - Wallet connection
     - Navigation
     - Responsive design
     - Performance

2. **Check Console for Errors**:
   - Open browser developer tools
   - Check for any JavaScript errors
   - Verify environment variables are loaded correctly

### 8. Monitor and Maintain

1. **Set Up Monitoring**:
   - Enable Vercel Analytics (optional)
   - Monitor performance metrics
   - Set up error tracking

2. **Regular Updates**:
   - Push changes to GitHub
   - Vercel will automatically redeploy
   - Test updates in preview deployments first

## Troubleshooting Common Issues

### Build Failures

1. **Dependency Issues**:
   - Check `package.json` for correct dependencies
   - Ensure all required packages are listed
   - Run `npm install` locally to test

2. **Environment Variable Issues**:
   - Verify all required environment variables are set
   - Check variable names match exactly (case-sensitive)
   - Ensure variables are available in all environments

3. **Build Command Issues**:
   - Verify build command is correct: `npm run build`
   - Check that output directory is set to `dist`
   - Ensure Vite configuration is correct

### Runtime Issues

1. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure chain ID matches your target network

2. **Contract Interaction Issues**:
   - Verify contract address is correct
   - Check that contract is deployed on the correct network
   - Ensure ABI matches the deployed contract

### Performance Issues

1. **Bundle Size**:
   - Check bundle size in Vercel analytics
   - Consider code splitting for large dependencies
   - Optimize images and assets

2. **Loading Speed**:
   - Enable Vercel's Edge Network
   - Use CDN for static assets
   - Optimize API calls

## Security Considerations

1. **Environment Variables**:
   - Never commit sensitive keys to GitHub
   - Use Vercel's environment variable system
   - Regularly rotate API keys

2. **HTTPS**:
   - Vercel automatically provides HTTPS
   - Ensure all external API calls use HTTPS
   - Configure proper CORS settings

3. **Content Security Policy**:
   - Configure CSP headers in `vercel.json`
   - Restrict external resource loading
   - Use nonces for inline scripts

## Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] Wallet connection works properly
- [ ] All pages are accessible
- [ ] Responsive design works on mobile
- [ ] Environment variables are loaded correctly
- [ ] Custom domain is configured (if applicable)
- [ ] Analytics are set up (if desired)
- [ ] Error monitoring is configured
- [ ] Performance is acceptable
- [ ] Security headers are in place

## Support and Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **RainbowKit Documentation**: [rainbowkit.com](https://rainbowkit.com)
- **Wagmi Documentation**: [wagmi.sh](https://wagmi.sh)

## Contact

For deployment issues or questions:
- Check the project's GitHub issues
- Review Vercel's deployment logs
- Consult the documentation links above

---

**Note**: This deployment guide assumes you have already deployed your smart contracts to the Sepolia testnet. If you haven't done so, please deploy the contracts first and update the `NEXT_PUBLIC_CONTRACT_ADDRESS` environment variable with the deployed contract address.
