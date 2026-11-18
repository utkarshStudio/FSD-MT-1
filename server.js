const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let leaves = [
    {
        id: 701,
        employeeName: "Ananya Singh",
        employeeCode: "EMP101",
        leaveType: "Casual",
        days: 2,
        status: "Pending"
    },
    {
        id: 702,
        employeeName: "Rahul Verma",
        employeeCode: "EMP102",
        leaveType: "Sick",
        days: 1,
        status: "Approved"
    },
    {
        id: 703,
        employeeName: "Simran Kaur",
        employeeCode: "EMP103",
        leaveType: "Earned",
        days: 3,
        status: "Rejected"
    }
];

let nextId = 704;

const leaveTypes = ["Casual", "Sick", "Earned"];
const statuses = ["Pending", "Approved", "Rejected"];

function validateLeave(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return "Request body must be a JSON object";
    }

    const requiredFields = [
        "employeeName",
        "employeeCode",
        "leaveType",
        "days",
        "status"
    ];

    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null || data[field] === "") {
            return field + " is required";
        }
    }

    if (typeof data.employeeName !== "string" || !data.employeeName.trim()) {
        return "employeeName must be a non-empty string";
    }

    if (typeof data.employeeCode !== "string" || !data.employeeCode.trim()) {
        return "employeeCode must be a non-empty string";
    }

    if (typeof data.leaveType !== "string" || !leaveTypes.includes(data.leaveType)) {
        return "leaveType must be Casual, Sick, or Earned";
    }

    if (!Number.isInteger(data.days) || data.days <= 0) {
        return "days must be a positive integer";
    }

    if (typeof data.status !== "string" || !statuses.includes(data.status)) {
        return "status must be Pending, Approved, or Rejected";
    }

    return null;
}

// GET all leave requests
app.get("/api/leaves", (req, res) => {
    res.status(200).json(leaves);
});

// POST a new leave request
app.post("/api/leaves", (req, res) => {
    const error = validateLeave(req.body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    const newLeave = {
        id: nextId++,
        employeeName: req.body.employeeName.trim(),
        employeeCode: req.body.employeeCode.trim(),
        leaveType: req.body.leaveType,
        days: req.body.days,
        status: req.body.status
    };

    leaves.push(newLeave);
    res.status(201).json(newLeave);
});

// Specific routes must come before /:id
// GET leave requests filtered by status (case-insensitive)
app.get("/api/leaves/filter", (req, res) => {
    const status = req.query.status;

    if (!status) {
        return res.status(400).json({ message: "Please provide a status query parameter" });
    }

    const result = leaves.filter(
        leave => leave.status.toLowerCase() === status.toLowerCase()
    );

    res.status(200).json(result);
});

// GET pending leave requests
app.get("/api/leaves/pending", (req, res) => {
    const result = leaves.filter(leave => leave.status === "Pending");
    res.status(200).json(result);
});

// GET leave request by ID
app.get("/api/leaves/:id", (req, res) => {
    const id = Number(req.params.id);
    const leave = leaves.find(item => item.id === id);

    if (!leave) {
        return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json(leave);
});

// PUT / update a leave request
app.put("/api/leaves/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = leaves.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Leave request not found" });
    }

    const error = validateLeave(req.body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    leaves[index] = {
        id: leaves[index].id,
        employeeName: req.body.employeeName.trim(),
        employeeCode: req.body.employeeCode.trim(),
        leaveType: req.body.leaveType,
        days: req.body.days,
        status: req.body.status
    };

    res.status(200).json(leaves[index]);
});

// DELETE a leave request
app.delete("/api/leaves/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = leaves.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Leave request not found" });
    }

    leaves.splice(index, 1);
    res.status(200).json({ message: "Leave request deleted successfully" });
});

// Handle invalid JSON / other errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON body" });
    }

    res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
    console.log("Employee Leave Management API running on http://localhost:" + PORT);
});
