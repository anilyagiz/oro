# GRAIL API Discovery Report

**Task:** 0.1 - Validate GRAIL API Access and Get Sandbox Keys  
**Date:** 2026-02-20  
**Status:** ✅ API Accessible - Authentication Required for Full Access

---

## Executive Summary

The Oro GRAIL API is **live and accessible** on devnet. Public endpoints respond successfully, and comprehensive documentation is available. However, **obtaining an API key requires partnership registration** with Oro Labs - this is a manual process that involves contacting the Oro team and completing KYC/partner onboarding.

### Key Findings

| Finding | Status | Details |
|---------|--------|---------|
| API Accessible | ✅ Yes | Devnet API at `oro-tradebook-devnet.up.railway.app` |
| Public Endpoints | ✅ Working | Health check and gold price return 200 |
| Authentication | ⚠️ Required | API key needed for all trading operations |
| Self-Custody Model | ✅ Available | Both Custodial and Self-Custody partner types supported |
| Partner Registration | ⚠️ Required | Must contact Oro team to become distribution partner |

---

## Base URL

```
https://oro-tradebook-devnet.up.railway.app
```

---

## Public Endpoints (No Authentication Required)

### 1. Health Check
- **URL:** `GET /health`
- **Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-20T13:32:50.179Z",
  "database": {
    "status": "healthy",
    "responseTime": 408
  },
  "environment": "production",
  "version": "1.0.0"
}
```
- **Test Result:** ✅ 200 OK

### 2. Get Gold Price
- **URL:** `GET /api/trading/gold/price`
- **Response:**
```json
{
  "success": true,
  "data": {
    "price": "5023.26",
    "unit": "troy_ounce",
    "currency": "USD",
    "timestamp": "2026-02-20T13:32:50.033Z"
  }
}
```
- **Test Result:** ✅ 200 OK
- **Source:** Pyth Network oracle

### 3. Submit Transaction
- **URL:** `POST /api/transactions/submit`
- **Note:** Public endpoint for submitting signed transactions

---

## Authentication-Required Endpoints

All trading and user management endpoints require API key authentication via `x-api-key` header.

### API Key Scopes

| Scope | Permissions |
|-------|-------------|
| `ADMIN` | System admin operations (partner creation) |
| `PARTNER_EXECUTIVE_AUTHORITY` | Trading operations (buy, sell, user creation) |
| `PARTNER_UPDATE_AUTHORITY` | Partner settings updates |
| `PARTNER_WITHDRAWAL_AUTHORITY` | Withdrawal operations |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/challenge` | Request challenge message to sign |
| POST | `/api/auth/api-key` | Create API key after signing challenge |
| GET | `/api/auth/api-keys` | List all API keys (metadata only) |
| POST | `/api/auth/api-keys/:id/revoke` | Revoke an API key |

### Trading Endpoints

| Method | Endpoint | Description | Required Scope |
|--------|----------|-------------|----------------|
| POST | `/api/trading/estimate/buy` | Estimate USDC cost for gold purchase | PARTNER_EXECUTIVE_AUTHORITY |
| POST | `/api/trading/estimate/sell` | Estimate USDC return for gold sale | PARTNER_EXECUTIVE_AUTHORITY |
| POST | `/api/trading/purchases/user` | Purchase gold for a user | PARTNER_EXECUTIVE_AUTHORITY |
| POST | `/api/trading/purchases/partner` | Purchase gold for partner reserves | PARTNER_EXECUTIVE_AUTHORITY |
| POST | `/api/trading/sells/user` | Sell gold for a user | PARTNER_EXECUTIVE_AUTHORITY |
| POST | `/api/trading/sells/partner` | Sell gold from partner reserves | PARTNER_EXECUTIVE_AUTHORITY |
| POST | `/api/trading/withdrawals` | Initiate withdrawal from PDA | PARTNER_WITHDRAWAL_AUTHORITY |

### User Management Endpoints

| Method | Endpoint | Description | Required Scope |
|--------|----------|-------------|----------------|
| POST | `/api/users` | Create new user | PARTNER_EXECUTIVE_AUTHORITY |
| GET | `/api/users` | List all users (paginated) | PARTNER_EXECUTIVE_AUTHORITY |
| GET | `/api/users/:id` | Get user details | PARTNER_EXECUTIVE_AUTHORITY |

### Distribution/Partner Endpoints

| Method | Endpoint | Description | Required Scope |
|--------|----------|-------------|----------------|
| GET | `/api/distribution/partner/me` | Get partner details | Any partner scope |
| POST | `/api/distribution/partner/executive-authority` | Update executive authority | PARTNER_UPDATE_AUTHORITY |

---

## Authentication Flow

Obtaining an API key requires a 3-step challenge-response process:

### Step 1: Request Challenge
```bash
curl -X POST https://oro-tradebook-devnet.up.railway.app/api/auth/challenge \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "YourSolanaWalletAddress",
    "keyType": "PARTNER",
    "partnerId": "1"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "challengeId": "abc123-def456",
    "message": "Sign this message to generate an API key for Oro Gold TradeBook: abc123-def456",
    "expiresAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Step 2: Sign Challenge
Sign the message with your partner wallet's private key (Ed25519 signature).

**Important:** You must be a registered distribution partner with a valid partner ID and authorized wallet address.

### Step 3: Create API Key
```bash
curl -X POST https://oro-tradebook-devnet.up.railway.app/api/auth/api-key \
  -H "Content-Type: application/json" \
  -d '{
    "challengeId": "abc123-def456",
    "signature": "base58EncodedSignature",
    "keyName": "My Trading Key"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "apiKey": "uuid-api-key-value",
    "id": "uuid-api-key-value",
    "scope": ["PARTNER_EXECUTIVE_AUTHORITY"],
    "name": "My Trading Key",
    "walletAddress": "YourSolanaWalletAddress",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Partner Types

### Custodial
- Partner manages user funds
- Users don't have wallets - partner holds gold on their behalf
- Only executive authority signs transactions

### Self-Custody
- Users control their own wallets
- Partner facilitates transactions but users sign and own assets
- User must sign their own transactions (with optional co-signing)

**OroRound MVP will use Self-Custody model** as specified in requirements.

---

## Transaction Flow

All trading operations follow this pattern:

```
1. Call API endpoint (e.g., /api/trading/purchases/user)
     ↓
2. Receive serialized transaction + signing instructions
     ↓
3. Deserialize and sign with required wallet(s)
     ↓
4. Submit via POST /api/transactions/submit
     ↓
5. Transaction confirmed on Solana
```

### Transaction Response Format
```json
{
  "transaction": {
    "serializedTx": "base64-encoded-transaction",
    "signingInstructions": {
      "walletType": "user_wallet, executive_authority",
      "signers": ["WalletAddress1", "WalletAddress2"],
      "expiresAt": "2024-01-15T10:35:00.000Z"
    }
  }
}
```

---

## How to Obtain API Access

### Current Blocker
**Cannot obtain API key without being a registered distribution partner.**

### Required Steps

1. **Contact Oro Team**
   - Website: https://orogold.app/grail
   - Documentation: https://docs.grail.oro.finance/
   - GRAIL Program: APIs and smart contracts to build gold-powered products

2. **Complete Partner Registration**
   - Submit partner application
   - Complete KYC/AML verification
   - Receive partner ID and authorized wallet addresses

3. **Generate API Keys**
   - Use partner wallet to complete challenge-response
   - Create API key with appropriate scope

### Contact Information Needed

To proceed with Wave 4 (GRAIL Integration), the OroRound team needs to:

1. Visit https://orogold.app/grail
2. Find "Become a Partner" or contact form
3. Request devnet/sandbox access for MVP development
4. Provide:
   - Project name: OroRound
   - Use case: Recurring gold purchases
   - Partner type: Self-Custody
   - Environment: Devnet for MVP, Mainnet for production

---

## Fallback Plan

Since API access requires partner registration, here is the **mock API structure** for UI development:

### Mock Endpoints (for development only)

```typescript
// Mock API Structure for OroRound MVP

interface MockGrailAPI {
  // Public endpoints (working)
  GET /health: { status: "healthy" }
  GET /api/trading/gold/price: { price: string, unit: "troy_ounce", currency: "USD" }
  
  // Protected endpoints (mock)
  POST /api/users: {
    request: { kycHash: string, userWalletAddress: string }
    response: { userId: string, userPda: string }
  }
  
  POST /api/trading/estimate/buy: {
    request: { goldAmount: number }
    response: { goldAmount: number, estimatedUsdc: number, goldPrice: number }
  }
  
  POST /api/trading/purchases/user: {
    request: { userId: string, goldAmount: number, maxUsdcAmount: number }
    response: { purchaseId: string, status: "pending_signature", serializedTx: string }
  }
  
  GET /api/transactions/:id: {
    response: { txId: string, status: "confirmed" | "pending" | "failed" }
  }
}
```

### UI Development Strategy

1. Use **public endpoints** for price display (real data)
2. Use **mock responses** for authenticated flows
3. Structure code to easily swap mock → real API
4. Implement proper error handling for 401/403 responses

---

## Documentation Resources

| Resource | URL |
|----------|-----|
| Main Docs | https://docs.grail.oro.finance/ |
| LLM-Optimized Index | https://docs.grail.oro.finance/llms.txt |
| API Overview | https://docs.grail.oro.finance/api-reference/overview.md |
| Authentication Guide | https://docs.grail.oro.finance/guides/authentication-and-setup.md |
| Buying Gold Guide | https://docs.grail.oro.finance/guides/buying-gold.md |
| Oro Website | https://orogold.app/ |
| GRAIL Program | https://orogold.app/grail |

---

## Test Evidence

### Test 1: Health Check
```bash
curl https://oro-tradebook-devnet.up.railway.app/health
```
**Result:** ✅ 200 OK  
**Response Time:** < 500ms  
**Database:** Connected and healthy

### Test 2: Gold Price
```bash
curl https://oro-tradebook-devnet.up.railway.app/api/trading/gold/price
```
**Result:** ✅ 200 OK  
**Price:** $5,023.26 USD per troy ounce  
**Timestamp:** 2026-02-20T13:32:50.033Z

### Test 3: Protected Endpoint (Expected 401)
```bash
curl https://oro-tradebook-devnet.up.railway.app/api/users
```
**Result:** ✅ 401 Unauthorized (as expected without API key)

---

## Next Steps for OroRound Team

### Immediate (Wave 1-3)
1. ✅ Document GRAIL API structure (DONE)
2. Proceed with UI development using mock API
3. Design transaction flows for Self-Custody model

### Before Wave 4 (Integration)
1. Contact Oro team at https://orogold.app/grail
2. Complete partner registration
3. Obtain devnet API keys
4. Test full integration flow
5. Request mainnet access for production

### Contact Template

```
Subject: Partner Application - OroRound MVP (Devnet Access)

Dear Oro Team,

We are building OroRound, a recurring gold purchase app using the GRAIL API.

Project Details:
- Name: OroRound
- Type: Self-Custody Distribution Partner
- Use Case: Automated recurring gold purchases for users
- Environment: Devnet for MVP development
- Timeline: MVP in development, seeking API access for integration testing

We would like to:
1. Register as a distribution partner
2. Obtain devnet API credentials
3. Test Self-Custody transaction flows
4. Prepare for mainnet launch

Please let us know the next steps for partner registration.

Best regards,
[Your Name]
OroRound Team
```

---

## Conclusion

The GRAIL API is **fully operational** and well-documented. The API supports both Custodial and Self-Custody models as required. The main blocker is partner registration, which requires manual outreach to the Oro team.

**Recommendation:** Proceed with UI development using mock data, and initiate partner registration concurrently. This allows parallel progress on both fronts without blocking development.

---

*Report generated by Sisyphus Task 0.1*  
*Evidence saved to: .sisyphus/evidence/task-0-1/api-discovery.md*
