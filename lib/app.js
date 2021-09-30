const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

// get whole database
app.get('/karlsbikes', async(req, res) => {
  try {
    const data = await client.query('SELECT * from karlsbikes');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// get one entry
app.get('/karlsbikes/:id', async(req, res) => {
  try {
    const data = await client.query('SELECT * from karlsbikes WHERE id=$1', [req.params.id]);

    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//create a new entry
app.post('/karlsbikes/', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO karlsbikes (year, make, model, color, type, img, rideable, owner_id)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING * `, [req.body.year, req.body.make, req.body.model, req.body.color, req.body.type, req.body.img, req.body.rideable, 1]);

    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: `this is what has gone south: ${e.message}` });
  }
});
//update an entry
app.put('/karlsbikes/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE karlsbikes
    SET year=$1, make=$2, model=$3, color=$4, type=$5, img=$6, rideable=$7, owner_id=$8
    WHERE id=$9
    RETURNING * `, [req.body.year, req.body.make, req.body.model, req.body.color, req.body.type, req.body.img, req.body.rideable, 1, req.params.id]);

    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: `this is what has gone south: ${e.message}` });
  }
});

//delete an entry
app.delete('/karlsbikes/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE from karlsbikes WHERE id=$1 RETURNING *', [req.params.id]);

    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
