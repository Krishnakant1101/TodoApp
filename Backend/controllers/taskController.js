const pool = require('../config/ db');
const DatabaseInteractionFunctions = require('../config/firebaseDb');

const getTasks = async (req, res) => {
    try {
        const todoData=DatabaseInteractionFunctions("todoData");
        const docRef=await todoData.getAll();
        const result = await pool.query('SELECT * FROM todotasks ORDER BY id ASC');
        res.status(200).send({firebaseResponse:{ todoData:docRef,message:"todoData received successfully " },
            postgresqlResponse:{Data:result.rows,message: "todoData received successfully"}
    } ) }catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}; 


const createTask = async (req, res) => {
    const { title, description, stage } = req.body;

    try {
        const todoData=DatabaseInteractionFunctions('todoData');
        const docRef=await todoData.add({title,description,stage});
        const result = await pool.query(
            'INSERT INTO todotasks (id, title, description, stage) VALUES ($1, $2, $3, $4) RETURNING *',
            [docRef.id, title, description, stage]
        );
        res.status(201).send({firebaseResponse:{ documentId: docRef.id, message: "todoData added successfully" },
            postgresqlResponse:{Data:result.rows[0],message: "todoData added successfully"}
        });

        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}; 


const updateTaskStage = async (req, res) => {
    const { id } = req.body;
    const { stage } = req.body;
    try {
        const todoData=DatabaseInteractionFunctions("todoData");
        const docRef=await todoData.update(id,{stage:stage});
        const result = await pool.query(
            'UPDATE todotasks SET stage = $1 WHERE id = $2 RETURNING *',
            [stage,id]
        );
        console.log(docRef);
        if (result.rows.length === 0||!docRef) {
            return res.status(404).send('Task not found in some of the databases [firebase or postgresql]');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}; 


const updateTask = async (req, res) => {
    const {id,title,description}=req.body
    try {
        const todoData=DatabaseInteractionFunctions("todoData");
        const docRef=await todoData.update(id,{title:title,description:description});
        const result = await pool.query(
            'UPDATE todotasks SET title = $1,description= $2 WHERE id = $3 RETURNING *',
            [title,description,id]
        );
        if (result.rows.length === 0||!docRef) {
            return res.status(404).send('Task not found in some of the databases [firebase or postgresql]');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}; 

const deleteTask = async (req, res) => {

    const { id } = req.body;

    try {
        const todoData=DatabaseInteractionFunctions("todoData");
        const docRef=await todoData.delete(id);
        const result = await pool.query('DELETE FROM todotasks WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0||!docRef) {
            return res.status(404).send('Task not found in some of the databases [firebase or postgresql]');
        }
        res.json({ message: 'Task deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}; 



module.exports = { getTasks, createTask, updateTask, deleteTask,updateTaskStage };
