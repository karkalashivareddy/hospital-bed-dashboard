# Hospital Bed Management System

## Overview

The Hospital Bed Management System is a web-based application developed to streamline the management of hospital bed availability and occupancy. The system enables hospital staff to monitor bed status, update availability, and maintain accurate occupancy records through an intuitive interface.

This project was developed as a college academic project to demonstrate the practical implementation of web technologies and database management in healthcare administration.

---

## Features

### Bed Management

* View all hospital beds and their current status
* Track available and occupied beds
* Update bed information dynamically

### Occupancy Management

* Allocate beds based on availability
* Release beds when they become vacant
* Maintain real-time occupancy records

### User Interface

* Simple and responsive design
* Easy navigation and accessibility
* Real-time data updates using API integration

### Backend Services

* RESTful API architecture
* MySQL database integration
* Environment-based configuration using `.env`

---

## Technology Stack

| Category | Technology            |
| -------- | --------------------- |
| Frontend | HTML, CSS, JavaScript |
| Backend  | Node.js, Express.js   |
| Database | MySQL                 |
| Styling  | Custom CSS            |

---

## Project Structure

```text
hospital-bed-management-system/
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── main.js
│   │   └── ui.js
│   │
│   └── index.html
│
├── server/
│   ├── db/
│   │   ├── connection.js
│   │   └── schema.sql
│   │
│   └── routes/
│       └── beds.js
│
├── .env
├── package.json
├── package-lock.json
├── server.js
├── .gitignore
├── ABSTRACT.md
└── README.md
```

---

## Installation and Setup

### Prerequisites

* Node.js (v14 or later)
* MySQL Server
* npm (Node Package Manager)

### Steps to Run the Project

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hospital-bed-management-system.git
```

#### 2. Navigate to the Project Directory

```bash
cd hospital-bed-management-system
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_beds
PORT=3000
```

#### 5. Set Up the Database

Import the SQL schema located in:

```text
server/db/schema.sql
```

Example:

```bash
mysql -u your_mysql_username -p hospital_beds < server/db/schema.sql
```

#### 6. Start the Application

```bash
npm start
```

#### 7. Open in Browser

```text
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint        | Description              |
| ------ | --------------- | ------------------------ |
| GET    | `/api/beds`     | Retrieve all bed records |
| POST   | `/api/beds`     | Add a new bed            |
| PUT    | `/api/beds/:id` | Update bed information   |
| DELETE | `/api/beds/:id` | Delete a bed record      |

---

## Available Scripts

| Command       | Description                              |
| ------------- | ---------------------------------------- |
| `npm start`   | Start the application                    |
| `npm run dev` | Start development server (if configured) |

---

## Future Enhancements

* Patient registration and management
* Ward and ICU categorization
* Authentication and authorization
* Real-time notifications
* Dashboard analytics and reporting
* Hospital staff management

---

## Team Members

This project was developed as a team project for academic purposes.

* Shiva
* Navadeep

---

## Acknowledgements

We express our sincere gratitude to our faculty members and institution for their guidance and support during the development of this project.

---

## License

This project is intended for educational and academic purposes only.
