# IPO Stock Access Implementation Guide

## Quick Start

This guide explains how to use the IPO stock access features that have been implemented in the Mobile-Home-Base project.

## Features Implemented

### 1. IPO Access Status Page (`/ipo-access`)
A dedicated page where investors can check their IPO access status. The page displays:
- Current approval status (pending, approved, or rejected)
- Investor information (name, email, application date)
- Status-specific actions and next steps
- Help and support information

**Location**: `/artifacts/spcx-market/src/pages/IPOAccess.tsx`

### 2. Enhanced Navigation
The side navigation menu now includes an "IPO Access" link that takes authenticated users to their status page.

**Location**: `/artifacts/spcx-market/src/components/SideNav.tsx`

### 3. Backend Investor Verification Endpoints
New API endpoints for managing investor verification and approval:

- `GET /api/investors/pending` - List all pending investors
- `POST /api/investors/batch-approve` - Approve multiple investors at once
- `GET /api/investors/search` - Search investors by email or name
- `GET /api/investors/stats` - Get investor statistics

**Location**: `/artifacts/api-server/src/routes/investor-verification.ts`

## User Workflows

### For Investors

#### 1. Registration Flow
1. Visit homepage (`/`)
2. Fill out signup form with full name and email
3. Submit form
4. Redirected to `/access-pending?email=...`
5. Receive notification that application is under review

#### 2. Check Status Flow
1. Sign in with email at `/signin`
2. Redirected to dashboard
3. Click "IPO Access" in side navigation
4. View current status and next steps

#### 3. Approved Investor Flow
1. Admin approves investor
2. Investor signs in and sees "IPO Access Approved" status
3. Can click "Go to Dashboard" or "Make a Deposit"
4. Access full trading platform

### For Admins

#### 1. View Pending Investors
```bash
curl -H "x-admin-password: $10$10$10" \
  http://localhost:3000/api/investors/pending
```

#### 2. Approve Multiple Investors
```bash
curl -X POST \
  -H "x-admin-password: $10$10$10" \
  -H "Content-Type: application/json" \
  -d '{"investorIds": [1, 2, 3]}' \
  http://localhost:3000/api/investors/batch-approve
```

#### 3. Search Investors
```bash
curl -H "x-admin-password: $10$10$10" \
  "http://localhost:3000/api/investors/search?q=john@example.com"
```

#### 4. Get Statistics
```bash
curl -H "x-admin-password: $10$admin-password: $10$10" \
  http://localhost:3000/api/investors/stats
```

## Status Lifecycle

### Pending Status
- **When**: Investor just registered
- **Duration**: 2-3 business days (configurable)
- **Display**: Clock icon, yellow color
- **Actions**: Wait for review, contact support
- **Next**: Approved or Rejected

### Approved Status
- **When**: Admin approves investor
- **Duration**: Indefinite (until revoked)
- **Display**: Check circle icon, green color
- **Actions**: Access dashboard, make deposits, trade
- **Next**: Can be revoked by admin

### Rejected Status
- **When**: Admin rejects investor
- **Duration**: Indefinite (until reapplied)
- **Display**: X circle icon, red color
- **Actions**: Contact support, reapply after 30 days
- **Next**: Can reapply

## Integration Points

### Frontend Routes
```
/                    - Public landing page
/signin              - Sign in
/ipo-access          - IPO access status (authenticated)
/dashboard           - Dashboard (approved only)
/orders              - Deposits (approved only)
/admin               - Admin panel (password protected)
```

### API Endpoints
```
POST   /api/investors              - Register investor
GET    /api/investors/count        - Get investor count
GET    /api/investors/pending      - List pending (admin)
POST   /api/investors/batch-approve - Batch approve (admin)
GET    /api/investors/search       - Search (admin)
GET    /api/investors/stats        - Statistics (admin)
POST   /api/signin                 - Sign in
GET    /api/holdings               - Get holdings
POST   /api/deposits               - Create deposit
GET    /api/stock/quote            - Stock quote
GET    /api/stock/history          - Stock history
PATCH  /api/admin/investors/:id/status - Update status
POST   /api/admin/investors/:id/credit - Credit shares
```

## Database Schema

### Investors Table
```sql
CREATE TABLE investors (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status investor_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Holdings Table
```sql
CREATE TABLE holdings (
  investor_id INTEGER PRIMARY KEY REFERENCES investors(id),
  shares NUMERIC(18,4) NOT NULL,
  avg_cost NUMERIC(18,4) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Deposits Table
```sql
CREATE TABLE deposits (
  id SERIAL PRIMARY KEY,
  investor_id INTEGER REFERENCES investors(id),
  email TEXT NOT NULL,
  amount NUMERIC(18,2) NOT NULL,
  method deposit_method NOT NULL,
  coin TEXT,
  status deposit_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Configuration

### Admin Password
Currently hardcoded as `$10$10$10` in:
- `/artifacts/api-server/src/routes/admin.ts`
- `/artifacts/api-server/src/routes/investor-verification.ts`

**To change**: Update the `ADMIN_PASSWORD` constant in both files.

### Environment Variables
```bash
PORT=3000                                    # API server port
DATABASE_URL=postgres://user:pass@localhost  # Database connection
NODE_ENV=development                         # Environment
```

## Testing

### Test Investor Registration
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"fullName": "John Doe", "email": "john@example.com"}' \
  http://localhost:3000/api/investors
```

### Test Sign In
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}' \
  http://localhost:3000/api/signin
```

### Test Admin Approval
```bash
curl -X PATCH \
  -H "x-admin-password: $10$10$10" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}' \
  http://localhost:3000/api/admin/investors/1/status
```

## Deployment

### Frontend Build
```bash
cd artifacts/spcx-market
pnpm run build
```

### Backend Build
```bash
cd artifacts/api-server
pnpm run build
```

### Run Development Servers
```bash
# Terminal 1: API Server
cd artifacts/api-server
export PORT=3000
export DATABASE_URL="postgres://user:pass@localhost:5432/db"
pnpm run dev

# Terminal 2: Frontend
cd artifacts/spcx-market
pnpm run dev
```

## Security Notes

1. **Admin Password**: Currently hardcoded. Use environment variables in production.
2. **Email Verification**: Not implemented. Add email verification for production.
3. **2FA**: Not implemented. Add two-factor authentication for admins.
4. **HTTPS**: Use HTTPS in production.
5. **CORS**: Currently allows all origins. Restrict in production.
6. **Rate Limiting**: Not implemented. Add rate limiting for registration.

## Future Enhancements

1. **Email Notifications**: Send approval/rejection emails
2. **KYC Integration**: Connect to KYC verification services
3. **Document Upload**: Support document verification
4. **Webhook Support**: Notify external systems of status changes
5. **Advanced Reporting**: Investor analytics and reporting
6. **API Keys**: Allow investors to use API directly
7. **Mobile App**: Native iOS/Android applications
8. **Audit Logging**: Comprehensive audit trail
9. **Role-Based Access**: Different admin roles
10. **Scheduled Tasks**: Auto-approve after verification period

## Troubleshooting

### Investor Can't Sign In
- Check if investor status is "approved"
- Verify email address is correct
- Check database for investor record

### Admin Can't Access Admin Panel
- Verify admin password is correct
- Check x-admin-password header is being sent
- Verify API server is running

### Holdings Not Showing
- Check if investor has been credited with shares
- Verify holdings record exists in database
- Check email parameter in holdings endpoint

### Deposits Not Processing
- Check deposit status in admin panel
- Verify investor is approved
- Check deposit amount is valid

## Support

For issues or questions:
- Email: support@spcxipo.live
- GitHub: https://github.com/CorpX430/Mobile-Home-Base
- Documentation: See IPO_IMPLEMENTATION_PLAN.md

## New Features (July 2026)

### 1. Dynamic Share Pricing
The order flow now supports selecting the number of shares with tiered pricing:
- < 25 shares: $147.62 / share
- 25-49 shares: $160.00 / share
- 50-99 shares: $180.00 / share
- 100+ shares: $200.00 / share

**Location**: `/artifacts/spcx-market/src/pages/Orders.tsx`

### 2. Admin Payment Address Management
Admins can now add and edit custom payment addresses for any asset (e.g., USDT, SOL) in the Admin Panel.
- **Add Asset**: Enter coin name and wallet address.
- **Edit Asset**: Update existing addresses directly.

**Location**: `/artifacts/spcx-market/src/pages/Admin.tsx`
