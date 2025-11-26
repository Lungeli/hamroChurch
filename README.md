# RTN FG Church Management System

## About The Project
Welcome to the RTN FG Church Management System: Your Ultimate Church Management Software

RTN FG Church is a comprehensive church management software designed to streamline and enhance the way you manage your congregation. With a user-friendly dashboard at its core, this powerful application simplifies church operations, making them more efficient and organized.

### Built With
 ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)  
 ![Next.js](https://img.shields.io/badge/Next.js-13.4.10-000000?style=for-the-badge&logo=next.js&logoColor=white)  
 ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)  
 ![Express](https://img.shields.io/badge/Express.js-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)  
 ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)  
 ![Ant Design](https://img.shields.io/badge/Ant%20Design-5.7.2-0170FE?style=for-the-badge&logo=ant-design&logoColor=white)

## Features
- [x] **Dashboard** - Comprehensive overview with statistics and quick actions
- [x] **Member Management** - Add, view, and manage church members
- [x] **Offerings Collection** - Track tithes, general offerings, and special offerings
- [x] **Offerings Report** - Generate detailed reports with PDF and CSV export
- [x] **Saturday Service Scheduling** - Schedule services with role assignments
- [x] **Event Management** - Create and manage church events
- [x] **User Authentication** - Secure login and registration system
- [x] **Profile Management** - User profile and password management

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **MongoDB** (or MongoDB Atlas account)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd hamroChurch
```

### 2. Install Server Dependencies

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

### 3. Install Client Dependencies

Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

## Configuration

### Database Configuration

The database configuration is located in `server/src/config/dbConfig.json`. Update it with your MongoDB connection details:

```json
{
    "MONGODB_DATABASE_NAME": "ChurchDB",
    "MONGODB_CONNECTION_URI": "your-mongodb-connection-string"
}
```

### Environment Variables

Create a `.env` file in the `server` directory if needed (currently using dbConfig.json for database connection).

## Running the Application

### Development Mode

#### 1. Start the Server

Open a terminal and navigate to the server directory:
```bash
cd server
npm run dev
```

The server will start on `http://localhost:4000`

#### 2. Start the Client

Open another terminal and navigate to the client directory:
```bash
cd client
npm run dev
```

The client will start on `http://localhost:3000`

### Production Mode

#### 1. Build the Client

```bash
cd client
npm run build
```

#### 2. Start the Client (Production)

```bash
cd client
npm start
```

#### 3. Start the Server (Production)

```bash
cd server
node src/index.js
```

## Project Structure

```
hamroChurch/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Next.js pages/routes
│   │   ├── redux/         # Redux store and slices
│   │   ├── styles/        # Global CSS styles
│   │   └── translations/  # i18n translation files
│   └── public/            # Static assets
└── server/                # Express.js backend application
    ├── src/
    │   ├── config/        # Configuration files
    │   ├── controller/    # Business logic controllers
    │   ├── models/        # Mongoose models
    │   ├── routes/        # API routes
    │   └── db/            # Database connection
    └── index.js           # Server entry point
```

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /register` - User registration

### Members
- `GET /member` - Get all members
- `POST /member` - Add new member
- `GET /gender-percentage` - Get gender distribution
- `GET /age-percentage` - Get age distribution

### Offerings
- `GET /donation` - Get all offerings
- `POST /donation` - Add new offering
- `GET /donation-amount` - Get total offerings
- `GET /donation-current-month` - Get current month offerings
- `GET /donation-report` - Generate PDF report

### Events
- `GET /event` - Get all events (includes auto-generated Saturday Services)
- `POST /event` - Add new event or schedule service

## Default Ports

- **Client (Frontend)**: `http://localhost:3000`
- **Server (Backend)**: `http://localhost:4000`

## Troubleshooting

### Common Issues

1. **Port already in use**: Make sure ports 3000 and 4000 are not being used by other applications
2. **Database connection error**: Verify your MongoDB connection string in `server/src/config/dbConfig.json`
3. **Module not found**: Run `npm install` in both client and server directories

## License

This project is proprietary software for RTN FG Church.

## Made by

**S Lungeli**
