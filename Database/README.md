# Database Architecture – MongoDB (Multitenant)

This project uses a multitenant MongoDB architecture.

## Overview
- One central database for global configuration
- One database per company (tenant)
- Databases are resolved dynamically by the backend

## Databases
- Central database: core
- Company database pattern: attendance_{companyId}

## Rules
- Each company has its own isolated database
- Attendance data is NEVER stored in the central database
- Facial embeddings belong to the company database
