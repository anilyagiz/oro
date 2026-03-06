# GRAIL API Discovery Summary

**Status:** ✅ API Accessible | ⚠️ Partner Registration Required

## Quick Facts

| Item | Value |
|------|-------|
| **Base URL** | `https://oro-tradebook-devnet.up.railway.app` |
| **Environment** | Devnet (Production API available) |
| **Auth Method** | API Key in `x-api-key` header |
| **Partner Model** | Self-Custody ✅ |
| **Gold Price** | ~$5,023.26 USD/oz (live from Pyth) |

## Confirmed Endpoints

### Public (No Auth)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | System health check |
| `/api/trading/gold/price` | GET | Current gold price |
| `/api/transactions/submit` | POST | Submit signed tx |

### Protected (API Key Required)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/challenge` | POST | Start auth flow |
| `/api/auth/api-key` | POST | Create API key |
| `/api/users` | POST | Create user |
| `/api/trading/estimate/buy` | POST | Get quote |
| `/api/trading/purchases/user` | POST | Purchase gold |

## Authentication Flow

```
1. POST /api/auth/challenge → Get challenge message
2. Sign message with wallet
3. POST /api/auth/api-key → Receive API key
4. Use API key in x-api-key header
```

**Note:** Requires registered partner wallet. Contact Oro team to become a partner.

## Test Results

```bash
# Health Check ✅
GET /health → 200 {"status":"healthy"}

# Gold Price ✅
GET /api/trading/gold/price → 200 {"price":"5023.26",...}

# Protected Endpoint ✅
GET /api/users → 401 (expected without key)
```

## Blocker: Partner Registration

API keys **cannot be obtained** without:
1. Partner registration with Oro Labs
2. KYC/AML verification
3. Approved partner wallet addresses

### Next Step

Contact Oro GRAIL team:
- **Website:** https://orogold.app/grail
- **Docs:** https://docs.grail.oro.finance/

Request: Devnet partner access for OroRound MVP (Self-Custody)

## Fallback Plan

Use **mock API** for UI development while awaiting partner approval:
- Public endpoints provide real data
- Mock responses for protected flows
- Easy swap to real API once approved

---

*Full documentation: `.sisyphus/evidence/task-0-1/api-discovery.md`*
