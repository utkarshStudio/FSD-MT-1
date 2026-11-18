# Set C – Employee Leave Management API

Node.js and Express.js REST API for the Set C practical assessment. All records are stored in an in-memory JavaScript array; data resets when the server restarts.

## Requirements
- Node.js and npm
- Postman or Thunder Client (for testing)

## Setup and run
```bash
npm install
npm start
```

Server URL: `http://localhost:3000`

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leaves` | Get all leave requests |
| POST | `/api/leaves` | Create a leave request |
| GET | `/api/leaves/filter?status=Approved` | Filter by status (case-insensitive) |
| GET | `/api/leaves/pending` | Get pending requests |
| GET | `/api/leaves/:id` | Get a request by ID |
| PUT | `/api/leaves/:id` | Replace/update a request |
| DELETE | `/api/leaves/:id` | Delete a request |

The `/filter` and `/pending` routes are declared before `/:id`.

## Sample POST/PUT JSON
Use `Content-Type: application/json`.

```json
{
  "employeeName": "Vikram Das",
  "employeeCode": "EMP104",
  "leaveType": "Earned",
  "days": 2,
  "status": "Pending"
}
```

## Validation
- All five request fields are required.
- `employeeName` and `employeeCode` must be non-empty strings.
- `leaveType` must be `Casual`, `Sick`, or `Earned`.
- `days` must be a positive integer.
- `status` must be `Pending`, `Approved`, or `Rejected`.
- Invalid bodies return HTTP 400.

## Initial records
- 701 – Ananya Singh – EMP101 – Casual – 2 – Pending
- 702 – Rahul Verma – EMP102 – Sick – 1 – Approved
- 703 – Simran Kaur – EMP103 – Earned – 3 – Rejected

## Quick testing examples

```bash
# Get all
curl http://localhost:3000/api/leaves

# Filter (case-insensitive)
curl "http://localhost:3000/api/leaves/filter?status=approved"

# Pending requests
curl http://localhost:3000/api/leaves/pending

# Get one
curl http://localhost:3000/api/leaves/701

# Create
curl -X POST http://localhost:3000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{"employeeName":"Vikram Das","employeeCode":"EMP104","leaveType":"Earned","days":2,"status":"Pending"}'

# Update
curl -X PUT http://localhost:3000/api/leaves/701 \
  -H "Content-Type: application/json" \
  -d '{"employeeName":"Ananya Singh","employeeCode":"EMP101","leaveType":"Casual","days":2,"status":"Approved"}'

# Delete
curl -X DELETE http://localhost:3000/api/leaves/703
```

## Expected status codes
- GET success: 200
- POST success: 201
- PUT success: 200
- DELETE success: 200
- Invalid request body: 400
- Missing record: 404
