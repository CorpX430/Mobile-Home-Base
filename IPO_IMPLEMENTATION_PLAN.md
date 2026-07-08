# IPO Stock Access Feature Implementation

## Overview
This document outlines the implementation of IPO stock access features for the Mobile-Home-Base project. The system enables accredited investors to register for IPO access, track their holdings, and participate in a pre-IPO trading platform for SPCX (SpaceX) shares.

## Current Architecture

### Frontend (React + Vite)
- **spcx-market**: Main investor portal with authentication, dashboard, and trading UI
- **Pages**:
  - `Home.tsx`: Public landing page with investor signup form
  - `SignIn.tsx`: Email-based authentication
  - `Dashboard.tsx`: Investor dashboard showing stock quotes and holdings
  - `Orders.tsx`: Deposit/purchase flow for investors
  - `Admin.tsx`: Admin panel for managing investors and deposits
  - `Management.tsx`: Company leadership and governance information

### Backend (Express.js + PostgreSQL)
- **API Routes**:
  - `/api/investors`: Investor registration and count
  - `/api/auth`: Sign-in endpoint
  - `/api/stock`: Mock stock quote and history data
  - `/api/holdings`: User holdings retrieval
  - `/api/deposits`: Deposit creation and crypto address management
  - `/api/admin`: Admin operations for investor and deposit management

### Database (Drizzle ORM)
- **Tables**:
  - `investors`: User profiles with status (pending, approved, rejected)
  - `holdings`: Share ownership and average cost
  - `deposits`: Deposit records with status tracking
  - `depositAddresses`: Crypto wallet addresses for deposits

## IPO Access Control Features

### 1. Investor Status Management
- **Status Levels**: pending, approved, rejected
- **Flow**:
  1. User registers → status = "pending"
  2. Admin reviews and approves → status = "approved"
  3. Approved users can sign in and access trading
  4. Rejected users receive notification

### 2. Access Gating
- **Public Pages**: Home, AccessPending
- **Authenticated Pages**: Dashboard, Orders, Management
- **Admin Pages**: Admin panel (password-protected)

### 3. Approval Workflow
- Admin dashboard lists all pending investors
- One-click approval/rejection buttons
- Approved status enables trading access
- Pending users see "Access Pending" page

### 4. Share Crediting System
- Admin can manually credit shares to approved investors
- Weighted average cost calculation on credit
- Holdings tracked per investor

### 5. Deposit Management
- Users submit deposits (card or crypto)
- Admin reviews and marks as completed/failed
- Deposits trigger share crediting

## Implementation Details

### Frontend Enhancements

#### 1. IPO Access Status Display
- Show investor status on dashboard
- Display pending status with timeline
- Show approval notifications

#### 2. Enhanced Signup Flow
- Add accreditation verification questions
- Collect additional investor information
- Show estimated approval timeline

#### 3. Admin Dashboard Improvements
- Add investor verification workflow
- Batch approval operations
- Investor search and filtering
- Detailed investor profiles

### Backend Enhancements

#### 1. Investor Verification
- Email verification endpoint
- Accreditation status tracking
- Document upload support (future)

#### 2. Enhanced Admin APIs
- Investor search and filtering
- Batch operations
- Audit logging
- Investor communication endpoints

#### 3. Compliance Features
- Access control by status
- Audit trail for all operations
- Regulatory compliance logging

## Key Features

### For Investors
1. **Registration**: Simple email + name signup
2. **Pending Status**: Clear communication during review
3. **Approval Notification**: Email notification when approved
4. **Trading Access**: Full platform access once approved
5. **Holdings Tracking**: Real-time share and value tracking
6. **Deposit Management**: Multiple deposit methods (card, crypto)

### For Admins
1. **Investor Management**: View, approve, reject, credit shares
2. **Deposit Review**: Review and process deposits
3. **Wallet Management**: Configure crypto deposit addresses
4. **Reporting**: Investor count, deposit tracking
5. **Batch Operations**: Approve multiple investors at once

## Security Considerations

1. **Authentication**: Email-based (can be enhanced with 2FA)
2. **Authorization**: Status-based access control
3. **Admin Access**: Password-protected (hardcoded for MVP, should use proper auth)
4. **Data Protection**: Sensitive investor data encrypted
5. **Audit Logging**: All admin actions logged

## Database Schema

### investors
```sql
CREATE TABLE investors (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status investor_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### holdings
```sql
CREATE TABLE holdings (
  investor_id INTEGER PRIMARY KEY REFERENCES investors(id),
  shares NUMERIC(18,4) NOT NULL,
  avg_cost NUMERIC(18,4) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### deposits
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

### depositAddresses
```sql
CREATE TABLE deposit_addresses (
  coin TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Public Endpoints
- `POST /api/investors` - Register new investor
- `GET /api/investors/count` - Get investor count
- `POST /api/signin` - Sign in with email
- `GET /api/stock/quote` - Get current stock quote
- `GET /api/stock/history` - Get stock price history
- `GET /api/deposit-addresses` - Get crypto addresses

### Authenticated Endpoints
- `GET /api/holdings` - Get user holdings
- `POST /api/deposits` - Create deposit request

### Admin Endpoints (x-admin-password header)
- `GET /api/admin/investors` - List all investors
- `PATCH /api/admin/investors/:id/status` - Update investor status
- `POST /api/admin/investors/:id/credit` - Credit shares to investor
- `GET /api/admin/deposits` - List all deposits
- `PATCH /api/admin/deposits/:id/status` - Update deposit status
- `GET /api/admin/deposit-addresses` - Get all addresses
- `PUT /api/admin/deposit-addresses/:coin` - Update address

## Testing Checklist

### Investor Flow
- [ ] User can register on home page
- [ ] Registered user sees pending status
- [ ] Admin can approve investor
- [ ] Approved investor can sign in
- [ ] Approved investor can see dashboard
- [ ] Approved investor can make deposits

### Admin Flow
- [ ] Admin can authenticate with password
- [ ] Admin can view all investors
- [ ] Admin can approve/reject investors
- [ ] Admin can credit shares
- [ ] Admin can manage deposits
- [ ] Admin can update crypto addresses

### Security
- [ ] Pending users cannot access dashboard
- [ ] Rejected users cannot sign in
- [ ] Unauthenticated users cannot access protected pages
- [ ] Invalid admin password is rejected

## Future Enhancements

1. **Email Notifications**: Send approval/rejection emails
2. **2FA Authentication**: Add two-factor authentication
3. **Document Verification**: Upload and verify investor documents
4. **KYC Integration**: Connect to KYC verification services
5. **Webhook Support**: Notify external systems of status changes
6. **Advanced Reporting**: Investor analytics and reporting
7. **API Keys**: Allow investors to use API directly
8. **Mobile App**: Native iOS/Android applications
