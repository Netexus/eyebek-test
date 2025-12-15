# Eyebek - Attendance Control System

A modern microservices-based attendance control system with facial recognition capabilities.

## 🏗️ Architecture Overview

This system uses a microservices architecture with the following components:

- **Backend**: .NET 8.0 REST API with MongoDB
- **Frontend**: Next.js 16 (TypeScript + TailwindCSS)
- **FacialAPI**: Python FastAPI service for facial recognition
- **Database**: MongoDB (multitenant architecture)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│  Frontend   │─────▶│   Backend    │
│  (Next.js)  │      │   (.NET 8)   │
└─────────────┘      └───┬────┬─────┘
                         │    │
                    ┌────▼─┐  └─────▶┌────────────┐
                    │ MongoDB     │   FacialAPI  │
                    │ (Multi-    │   │  (Python)  │
                    │ tenant)    │   └────────────┘
                    └──────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Running the System

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd eyebek
   ```

2. **Create environment file** (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your configuration if needed
   ```

3. **Start all services**:
   ```bash
   docker compose up -d
   ```

4. **Access the applications**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Backend Swagger: http://localhost:5000/swagger
   - FacialAPI: http://localhost:8000
   - MongoDB: localhost:27017

### Stopping the System

```bash
docker compose down
```

To remove volumes (delete all data):
```bash
docker compose down -v
```

## 📊 MongoDB Multitenant Architecture

The system uses a dual-database approach:

### Core Database (`core`)
Stores global configuration and company data:
- `companies` - Company accounts
- `plans` - Subscription plans
- `payments` - Payment records
- `sessions` - Authentication sessions

### Tenant Databases (`attendance_{companyId}`)
Each company gets its own database:
- `users` - Company employees
- `attendances` - Attendance records
- Facial embeddings stored in user documents

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication.

**Default SuperAdmin Credentials**:
- Email: `superadmin@eyebek.com`
- Password: `SuperAdmin123!`

⚠️ **Change these credentials in production!**

## 🛠️ Development

### Backend Development

```bash
cd Backend
dotnet restore
dotnet run --project src/Eyebek.Api
```

### Frontend Development

```bash
cd Frontend
npm install
npm run dev
```

### FacialAPI Development

```bash
cd FacialAPI
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📝 Environment Variables

Key environment variables (see `.env.example` for complete list):

### MongoDB
- `MONGODB_CONNECTION_STRING`: MongoDB connection string
- `MONGODB_CORE_DATABASE`: Core database name (default: `core`)

### Backend
- `JWT_KEY`: Secret key for JWT tokens
- `FACIAL_API_URL`: URL to facial recognition service

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
docker compose logs mongodb
```

### Backend Not Starting
```bash
docker compose logs backend
```

### Check Service Health
```bash
curl http://localhost:5000/health
curl http://localhost:8000/health
```

### Rebuild Services
```bash
docker compose build --no-cache
docker compose up -d
```

## 📁 Project Structure

```
eyebek/
├── Backend/              # .NET 8 Backend API
│   ├── src/
│   │   ├── Eyebek.Api/          # API Layer
│   │   ├── Eyebek.Application/  # Business Logic
│   │   ├── Eyebek.Domain/       # Domain Entities
│   │   └── Eyebek.Infrastructure/ # Data Access
│   └── Dockerfile
├── Frontend/             # Next.js Frontend
│   ├── src/
│   └── Dockerfile
├── FacialAPI/           # Python Facial Recognition
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── Database/            # Database Documentation
│   └── schemas/
├── docker-compose.yml   # Docker Orchestration
└── README.md
```

## 🔒 Security Considerations

- **JWT Secrets**: Change default JWT key in production
- **CORS**: Configure proper CORS origins for production
- **MongoDB**: Enable authentication for production deployments
- **SSL/TLS**: Use HTTPS in production
- **Facial Data**: Facial embeddings are sensitive - ensure proper encryption

## 📈 Scaling Recommendations

1. **MongoDB**: Use replica sets for high availability
2. **Backend**: Deploy multiple instances behind a load balancer
3. **FacialAPI**: Scale horizontally for concurrent facial recognition requests
4. **Frontend**: Use CDN for static assets
5. **Caching**: Add Redis for session management and API caching

## 📚 Additional Documentation

- [Architecture Details](./ARCHITECTURE.md)
- [Database Schemas](./Database/README.md)
- [API Documentation](http://localhost:5000/swagger) (when running)

## 🤝 Support

For issues and questions, please check the troubleshooting section or consult the architecture documentation.

---

**Built with ❤️ using .NET, Next.js, Python, and MongoDB**
