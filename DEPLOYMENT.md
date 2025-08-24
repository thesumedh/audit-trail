# CorporateAuditChain - Production Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ 
- Petra Wallet installed
- Aptos CLI (optional, for Move contract deployment)

### 1. Environment Setup
```bash
# Clone repository
git clone https://github.com/thesumedh/aptos.git
cd aptos

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 2. Local Development
```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### 3. Production Build
```bash
# Build for production
npm run build

# Test production build locally
npm start
```

## 🏢 Enterprise Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### AWS/Azure/GCP
```bash
# Build static export
npm run export

# Upload 'out' directory to your cloud storage
# Configure CDN and custom domain
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Environment Variables
```bash
# Required
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_CONTRACT_ADDRESS=0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02

# Optional
NEXT_PUBLIC_APP_NAME=CorporateAuditChain
NEXT_PUBLIC_LEGAL_ENTITY_NAME=Your Company Name
NEXT_PUBLIC_COMPLIANCE_OFFICER=compliance@yourcompany.com
```

### Petra Wallet Setup
1. Install Petra Wallet browser extension
2. Create/import wallet
3. Switch to Aptos Testnet
4. Fund wallet with test APT from faucet

## 🔐 Security Considerations

### Production Checklist
- [ ] Use HTTPS in production
- [ ] Configure proper CORS headers
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Configure backup systems
- [ ] Set up monitoring and alerts

### Legal Compliance
- [ ] Data retention policies
- [ ] Privacy policy updates
- [ ] Terms of service
- [ ] Regulatory compliance review
- [ ] Security audit

## 📊 Monitoring & Analytics

### Recommended Tools
- **Uptime**: Pingdom, UptimeRobot
- **Analytics**: Google Analytics, Mixpanel
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog

### Key Metrics to Track
- Audit trail creation rate
- Legal discovery requests
- Blockchain transaction success rate
- User engagement metrics
- System performance metrics

## 🔄 Maintenance

### Regular Tasks
- Monitor blockchain network status
- Update dependencies monthly
- Review audit logs weekly
- Backup legal discovery reports
- Performance optimization

### Scaling Considerations
- Database optimization for large datasets
- CDN configuration for global access
- Load balancing for high traffic
- Blockchain node redundancy

## 🆘 Troubleshooting

### Common Issues
1. **Petra Wallet Connection Failed**
   - Ensure Petra is installed and unlocked
   - Check network configuration (testnet vs mainnet)
   - Clear browser cache and cookies

2. **Blockchain Transaction Errors**
   - Verify wallet has sufficient APT balance
   - Check Aptos network status
   - Retry with higher gas fees

3. **Legal Discovery Report Generation**
   - Ensure sufficient audit data exists
   - Check date range validity
   - Verify PDF generation permissions

### Support Contacts
- Technical Support: tech@corporateauditchain.com
- Legal Questions: legal@corporateauditchain.com
- Emergency: +1-555-AUDIT-911

## 📈 Performance Optimization

### Frontend Optimization
- Enable Next.js image optimization
- Configure proper caching headers
- Use CDN for static assets
- Implement lazy loading

### Blockchain Optimization
- Batch transactions when possible
- Use appropriate gas limits
- Implement transaction retry logic
- Cache blockchain queries

## 🔒 Backup & Recovery

### Data Backup Strategy
1. **Audit Store**: Daily automated backups
2. **Legal Reports**: Immutable storage with redundancy
3. **Configuration**: Version controlled in Git
4. **Blockchain Data**: Inherently backed up on Aptos network

### Disaster Recovery Plan
1. Identify critical systems
2. Document recovery procedures
3. Test recovery processes monthly
4. Maintain emergency contacts
5. Ensure legal compliance during outages