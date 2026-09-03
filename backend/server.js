const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database', err);
    } else {
        console.log('Connected to SQLite database');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`);

        // Hairstyles Table
        db.run(`CREATE TABLE IF NOT EXISTS hairstyles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            match INTEGER,
            category TEXT,
            img TEXT
        )`);

        // Salons Table
        db.run(`CREATE TABLE IF NOT EXISTS salons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            rating REAL,
            reviews INTEGER,
            distance TEXT,
            address TEXT,
            price TEXT
        )`);

        // Appointments Table
        db.run(`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            salonId INTEGER,
            styleId INTEGER,
            date TEXT,
            FOREIGN KEY(userId) REFERENCES users(id),
            FOREIGN KEY(salonId) REFERENCES salons(id),
            FOREIGN KEY(styleId) REFERENCES hairstyles(id)
        )`);

        // Seed initial data if empty
        db.get("SELECT COUNT(*) AS count FROM hairstyles", (err, row) => {
            if (row && row.count === 0) {
                const hairstyles = [
                    { name: "Textured Fringe", match: 98, category: "Trending", img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=300&q=80" },
                    { name: "Modern Quiff", match: 94, category: "Classic", img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=300&q=80" },
                    { name: "Classic Taper Fade", match: 89, category: "Short", img: "https://images.unsplash.com/photo-1582230208018-b468ce484b96?auto=format&fit=crop&w=300&q=80" },
                    { name: "Textured Crop", match: 87, category: "Short", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80" }
                ];
                
                const stmt = db.prepare("INSERT INTO hairstyles (name, match, category, img) VALUES (?, ?, ?, ?)");
                hairstyles.forEach(h => stmt.run(h.name, h.match, h.category, h.img));
                stmt.finalize();
            }
        });

        db.get("SELECT COUNT(*) AS count FROM salons", (err, row) => {
            if (row && row.count === 0) {
                const salons = [
                    { name: "Luxe Hairstyle Studio", rating: 4.9, reviews: 128, distance: "0.8 miles away", address: "142 Fashion Ave", price: "$45 - $85" },
                    { name: "Aura Salon & Spa", rating: 4.8, reviews: 94, distance: "1.5 miles away", address: "88 Grand Street", price: "$35 - $70" },
                    { name: "Vogue Hair Lab", rating: 5.0, reviews: 210, distance: "2.3 miles away", address: "305 Fifth Blvd", price: "$60 - $120" }
                ];

                const stmt = db.prepare("INSERT INTO salons (name, rating, reviews, distance, address, price) VALUES (?, ?, ?, ?, ?, ?)");
                salons.forEach(s => stmt.run(s.name, s.rating, s.reviews, s.distance, s.address, s.price));
                stmt.finalize();
            }
        });
    });
}

// Routes
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], function(err) {
        if (err) {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.json({ id: this.lastID, name, email });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err || !row) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json({ id: row.id, name: row.name, email: row.email });
    });
});

app.get('/api/hairstyles', (req, res) => {
    db.all("SELECT * FROM hairstyles", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/salons', (req, res) => {
    db.all("SELECT * FROM salons", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/appointments', (req, res) => {
    const { userId, salonId, styleId, date } = req.body;
    if (!userId || !salonId || !styleId || !date) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    db.run("INSERT INTO appointments (userId, salonId, styleId, date) VALUES (?, ?, ?, ?)", 
        [userId, salonId, styleId, date], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: "Appointment booked successfully!" });
        }
    );
});

app.get('/api/appointments/:userId', (req, res) => {
    const { userId } = req.params;
    db.all(`
        SELECT a.id, a.date, s.name as salonName, h.name as styleName 
        FROM appointments a
        JOIN salons s ON a.salonId = s.id
        JOIN hairstyles h ON a.styleId = h.id
        WHERE a.userId = ?
    `, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
