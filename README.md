# Angular .NET Web Project

## Overview
This repository contains a web application built using Angular for the frontend and .NET for the backend. The project demonstrates a typical setup for a full-stack web application.

## Features
- **Frontend**: Angular
- **Backend**: .NET
- **Database**: SQL Server (or specify your DB)

## Prerequisites
- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- [.NET SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server)

## Installation

### Clone the repository
```bash
git clone https://github.com/maksimscaplinskis/Angular-Net-WebProject.git
```
```bash
cd Angular-Net-WebProject
```

### Backend setup

1. Navigate to the backend directory
```bash
cd API
```
2. Restore the .NET dependencies:
```bash
dotnet restore
```
3. Update the database connection string in `appsetting.json`:
```json
"ConnectionStrings": {
    "DefaultConnection": "Server=CHANGE-ME; Database=ArticleDB; Trusted_connection=true; TrustServerCertificate=true"
}
```
4. Apply database migration:
```bash
dotnet ef database update
```
5. Run the backend server:
```bash
dotnet run
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd UI
```
2. Install the nmp dependencies:
```bash
npm install
```
3. Run the frontend server:
```bash
ng serve
```
# Usage

1. Open your browser and navigate to http://localhost:4200 to access the frontend.
2. The backend API should be running on https://localhost:7280.