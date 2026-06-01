# 🚀 TAMV Online - Real del Monte Digital

## Status: ✅ **PRODUCTION READY** (v1.0.0)

**Territorial Awareness & Multidimensional Visualization**
Real del Monte Digital - L0-L7 Federated Architecture

---

## 📋 What is TAMV?

**TAMV Online** is a sophisticated, production-ready territorial digital platform implementing a 7-layer federation:

```
L7: Quantum-Inspired Feedback Loop (AI Adaptation)
L6: UX Shell (React Components)
L5: Domain Services (Identity, Commerce, Telemetry)
L4: XR/Visual & Spatial (Gen8, Geographic Indexing)
L3: Guardianship & Observability (Health, Alerts)
L2: Protocols & Control (Orchestration)
L1: Memory & Registry (EOCT, MSR, BookPi)
L0: Doctrine & Ethics (Governance)
```

---

## ⚡ Quick Start (60 seconds)

### Prerequisites
```bash
node --version  # v20.0.0+
npm --version   # v10.0.0+
```

### Installation
```bash
# 1. Clone
git clone https://github.com/OsoPanda1/real-del-monte-digital.git
cd real-del-monte-digital

# 2. Install dependencies
npm install

# 3. Environment setup
cp .env.example .env.local

# 4. Start development
npm run dev

# 5. Open in browser
# http://localhost:5173
```

---

## 🧪 Testing

```bash
npm run test          # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run validate      # Full validation
```

---

## 🐳 Deployment

### Docker
```bash
docker build -t tamv-digital .
docker run -p 3000:3000 tamv-digital
docker-compose up
```

### Vercel (Recommended)
```bash
vercel link
vercel deploy --prod
```

### Self-Hosted
```bash
npm run build
npm run serve:prod
```

---

## 📚 Documentation

- **`ARCHITECTURE.md`** - Full architecture guide
- **`DEPLOYMENT.md`** - Deployment & operations
- **`src/index.ts`** - Core exports

---

## 🎯 Core Features

✅ **L0: Ethical Governance** (EOCT)
✅ **L1: Audit Trail** (MSR + BookPi)
✅ **L2: Protocol Engine** (Orchestration)
✅ **L4: Spatial Indexing** (O(1) queries)
✅ **L4: Contextual Decisions** (Gen8)
✅ **L7: AI Feedback Loop** (Quantum-inspired)
✅ **Event-Driven Architecture**
✅ **Structured Logging**
✅ **Production CI/CD**
✅ **Docker & Kubernetes Ready**

---

## 📊 Observability

```typescript
// Get metrics
const metrics = tamvCoordinator.getMetrics();

// Health check
const health = await tamvCoordinator.health();
```

---

## 🔐 Security

✅ Ethical rule enforcement
✅ Immutable audit trail
✅ Input validation
✅ Rate limiting ready
✅ CORS configured
✅ Type-safe

---

## 📁 Project Structure

```
src/
├── core/
│   ├── types/          # L0-L7 types
│   ├── logger/         # Logging
│   ├── event/          # Event system
│   ├── geo/            # Spatial indexing
│   ├── ai/             # Feedback loops
│   └── orchestrator/   # TAMV Coordinator
├── lib/
│   └── tamv/           # EOCT, MSR, BookPi, Protocol
├── config/
└── index.ts
```

---

## 🆘 Troubleshooting

```bash
# Port conflict
lsof -ti:5173 | xargs kill -9

# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules && npm install
```

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/OsoPanda1/real-del-monte-digital/issues)
- **Docs**: See ARCHITECTURE.md

---

## 📜 License

**TAMV Online Enterprise © 2026**
All rights reserved.

---

## 👤 Author

**Edwin Oswaldo Castillo Trejo** (Anubis Villaseñor)
ORCID: 0009-0008-5050-1539

---

**Status**: ✅ **PRODUCTION READY**
**Branch**: `feat/tamv-federation-production`
**Version**: 1.0.0
