const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { signupSchema, loginSchema } = require('../utils/validationSchemas');
const pool = require('../config/ db');
const JWT_SECRET = require('../config/ jwt');
const DatabaseInteractionFunctions = require('../config/firebaseDb');


const signup = async (req, res) => {
    try {
        // Validate user data using Joi schema
        const validationResult = signupSchema.validate(req.body);
        if (validationResult.error) {
            const errorDetails = validationResult.error.details.map((value) =>
                value.message.replaceAll("\"", "")
            );
            return res.status(400).send({ error: errorDetails });
        }

        const { firstname, lastname, email, password } = req.body;

        // Check if the email already exists in the database
        try {
            const existingUser = await pool.query(
                'SELECT email FROM userdata WHERE email = $1',
                [email]
            );
            if (existingUser.rows.length > 0) {
                return res.status(409).send({ error: "Conflict: Email already exists." });
            }
        } catch (dbError) {
            console.error("Error during email existence check:", dbError);
            return res.status(500).send({ error: "Failed to check user existence. Please try again later." });
        }

        // Hash the password
        let password_hash;
        try {
            password_hash = await bcrypt.hash(password, 11);
        } catch (hashError) {
            console.error("Error during bcrypt.hash():", hashError);
            return res.status(500).send({ error: "Failed to hash password. Please try again later." });
        }

        // Insert user data into the database
        try {
            const signUpData=DatabaseInteractionFunctions('signUpData');
            const docRef= await signUpData.add({firstname,lastname,email,password_hash});
            const result = await pool.query(
                'INSERT INTO userdata (firstname, lastname, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
                [firstname, lastname, email, password_hash]
            );
        
            res.status(201).send({firebaseResponse:{ documentId: docRef.id, message: "User created successfully" },
                postgresqlResponse:{Data:result.rows[0],message: "User created successfully"}
            });
        } catch (insertError) {
            console.error("Database error during user insertion:", insertError);
            return res.status(500).send({ error: "Failed to create user. Please try again later." });
        }
    } catch (error) {
        console.error("Unexpected error in signup route:", error);
        return res.status(500).send({ error: "An unexpected error occurred. Please try again later." });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate
        const validationResult = loginSchema.validate(req.body);
        if (validationResult.error) {
            const errorDetails = validationResult.error.details.map((value) =>
                value.message.replaceAll("\"", "")
            );
            return res.status(400).send({ error: errorDetails });
        }
        // Fetch user by email
        const result = await pool.query('SELECT email, firstname, password_hash FROM userdata WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            // Email not found
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const hashedPassword = result.rows[0].password_hash;

        // Compare provided password with stored hash
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' });

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            firstname:result.rows[0].firstname,
            token,
        });
    } catch (error) {
        console.error("Error during login process:", error);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
};

module.exports = { signup, login };
