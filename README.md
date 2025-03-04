## Setup Guide

### Prerequisites
- Ensure **PostgreSQL** is installed and running.
- Update database credentials in `src/config/database.js`:

```javascript
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres", 
  host: "localhost",
  database: "attendance_db", 
  password: "your_password", 
  port: 5432, 
});

export default pool;
```

### Installation
```sh
npm install
```

### Start the Server
```sh
npm start
```

## API Usage using curl

### 1. Create a New Class

**Endpoint:** `POST /api/classes`

**Request:**

```sh
curl -X POST http://{API_URL}/api/classes \
     -H "Content-Type: application/json" \
     -d '{ "class_name": "CS101" }'
```

**Response:**

```json
{
  "message": "Class created",
  "class_id": 1
}
```

---

### 2. Import Users via CSV

**Endpoint:** `POST /api/classes/{class_id}/import`

**Request:**

```sh
curl -X POST -F "csvFile=@path/to/file.csv" http://{API_URL}/api/classes/1/import
```

**Response:**

```json
{
  "message": "Users imported",
  "total_users": 30
}
```

---

### 3. Mark Attendance

**Endpoint:** `POST /api/classes/{class_id}/attendance`

**Request:**

```sh
curl -X POST http://{API_URL}/api/classes/1/attendance \
     -H "Content-Type: application/json" \
     -d '{ "unique_number": "12345" }'
```

**Response (if found):**

```json
{
  "message": "Attendance updated",
  "unique_number": "12345",
  "status": "Present"
}
```

**Response (if not found):**

```json
{
  "message": "User not found",
  "unique_number": "12345"
}
```

---

### 4. Fetch Present Members

**Endpoint:** `GET /api/classes/{class_id}/present`

**Request:**

```sh
curl -X GET http://{API_URL}/api/classes/1/present
```

**Response:**

```json
{
  "class_id": 1,
  "date": "2025-02-11",
  "present_students": [
    { "unique_number": "12345", "name": "John Doe" },
    { "unique_number": "67890", "name": "Jane Smith" }
  ]
}
```

---

### 5. Fetch Absent Members

**Endpoint:** `GET /api/classes/{class_id}/absent`

**Request:**

```sh
curl -X GET http://{API_URL}/api/classes/1/absent
```

**Response:**

```json
{
  "class_id": 1,
  "date": "2025-02-11",
  "absent_students": [
    { "unique_number": "54321", "name": "Alice Brown" },
    { "unique_number": "98765", "name": "Bob Wilson" }
  ]
}
```

---


