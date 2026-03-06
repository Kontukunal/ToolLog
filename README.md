# 🏭 ToolLog: Equipment Management System

A full-stack MERN application for managing equipment and their maintenance lifecycle. Track equipment status, maintenance history, and enforce business rules automatically.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-latest-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)

## 📋 Features

- **Equipment Management**: Create, read, update, and delete equipment records
- **Maintenance Logging**: Record maintenance events with automatic status updates
- **Smart Status Rules**: Equipment cannot be "Active" if last cleaned date > 30 days
- **Dynamic Equipment Types**: Types are stored in database, editable without code changes
- **Maintenance History**: View complete maintenance history for each equipment
- **Responsive UI**: Modern, user-friendly interface with Tailwind CSS

<img width="1895" height="835" alt="image" src="https://github.com/user-attachments/assets/86f05edf-026d-4f6a-8f50-96dc5dd3d839" />

<img width="1777" height="810" alt="image" src="https://github.com/user-attachments/assets/270880ab-8442-4193-9963-ca714563def2" />

<img width="1866" height="808" alt="image" src="https://github.com/user-attachments/assets/08af84ee-3744-4023-a40e-3309bb67072a" />

<img width="1834" height="816" alt="image" src="https://github.com/user-attachments/assets/c9e56235-ae5e-4704-b294-dca8c8c925f7" />


## 🛠️ Technology Stack

### Frontend
- React.js
- Tailwind CSS 
- Custom reusable components (no UI library)
- React Scripts

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled



## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/Kontukunal/ToolLog
cd ToolLog
```

### Step 2: Backend Setup

```
# Navigate to server directory
cd server

# Install dependencies
npm install express mongoose cors dotenv helmet express-mongo-sanitize
npm install -D nodemon

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/equipment-management
NODE_ENV=development" > .env

# Seed the database with initial equipment types (optional)
node seed.js

# Start the backend server
npm start
```
The backend will start on http://localhost:5000

### Step 3: Frontend Setup

```
# Open a new terminal
# Navigate to client directory
cd client

# Install dependencies
npm install react react-dom react-scripts tailwindcss

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start the frontend development server
npm run dev
```


### Step 4: Database Seeding
To populate initial equipment types:

```
cd server
node seed.js
```

This will create equipment types:

- HVAC (Heating, Ventilation, and Air Conditioning equipment)
- Electrical (Electrical equipment and components)
- Plumbing (Plumbing fixtures and systems)
- Safety (Safety and security equipment)
- IT (Information technology equipment)
- Medical (Medical and healthcare equipment)
- Laboratory (Laboratory equipment)
- Kitchen (Kitchen and food service equipment)


## 🛠️ Business Logic & Rules

This system implements strict operational workflows to ensure equipment safety and data integrity.

### Rule 1: Maintenance Logging Workflow
Whenever a new maintenance activity is recorded, the system automates the following updates:
* **Status Synchronization:** The equipment's status is automatically set to `Active`.
* **Cleaning Recency:** The `Last Cleaned Date` field is automatically updated to match the `Maintenance Date` provided in the log.
* **Persistence:** These changes are enforced at the database level during the maintenance log creation transaction.

### Rule 2: Active Status Constraint
To ensure compliance with safety standards, the following constraint is enforced in the backend:
* **30-Day Policy:** Equipment **cannot** be marked as `Active` if the `Last Cleaned Date` is more than 30 days in the past.
* **Validation:** * **Backend:** Rejects `POST` or `PUT` requests that violate this rule with a `400 Bad Request` status.
    * **Frontend:** The UI captures the error response and displays a descriptive message to the user (e.g., *"Cannot activate: Last cleaning was over 30 days ago"*).

---
