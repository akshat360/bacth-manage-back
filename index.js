/** @format */

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuid } = require('uuid');

const app = express();

const connection = mysql.createConnection({
	host: 'localhost',
	port: 8889,
	user: 'root',
	password: 'root',
	database: 'pep_classroom',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
});

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

const PORT = process.env.PORT || 3002;

// DataBase Connection ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

connection.connect(function (err) {
	if (err) throw err;
	console.log('Connected!');
});

// DataBase Operations ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.get('/showdb', (req, res) => {
	connection.query('show DATABASES', function (err, data) {
		if (err) return res.json({ status: false, err: err });
		return res.json({ status: true, data });
	});
});

app.get('/showtables', (req, res) => {
	connection.query('show Tables', function (err, data) {
		if (err) return res.json({ status: false, err: err });
		return res.json({ status: true, data });
	});
});

app.get('/createdb', (req, res) => {
	connection.query('CREATE DATABASE pep_classroom', function (err, data) {
		if (err) throw err;
		console.log('Database created');
	});
	return res.send('Hello');
});

// Ctreate TABLES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.get('/batch/create', (req, res) => {
	const sql = `CREATE TABLE BATCH
  (ID VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL)`;

	connection.query(sql, (err, data) => {
		if (err) return res.json({ status: false, err: err });
		return res.json({ status: true, message: 'Batch Table Created', data });
	});
});

app.get('/teachers/create', (req, res) => {
	const sql = `CREATE TABLE Teachers 
    (ID VARCHAR(255) NOT NULL PRIMARY KEY, name VARCHAR(255)  NOT NULL)`;

	connection.query(sql, (err, data) => {
		if (err) return res.json({ status: false, err: err });
		return res.json({ status: true, message: 'Batch Table Created', data });
	});
});

app.get('/classroom/create', (req, res) => {
	const sql = `CREATE TABLE CLASSROOM (ID VARCHAR(255) NOT NULL PRIMARY KEY, teacherId VARCHAR(255), batchId VARCHAR(255),date Date, startTime DATETIME, endTime DATETIME)`;

	connection.query(sql, (err, data) => {
		if (err) return res.json({ status: false, err: err });
		return res.json({ status: true, message: 'Batch Table Created', data });
	});
});

// Add to Tables ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.post('/batch/add', (req, res) => {
	try {
		const batchData = { id: uuid(), name: req.body.name };
		console.log('batch/add', batchData);

		connection.query('INSERT INTO BATCH SET ?', batchData, (err, data) => {
			console.log('err', err);

			if (err)
				return res.status(400).json({
					status: false,
					message: 'Batch Creation Failed',
					err: err,
				});
			return res.json({ status: true, message: 'Batch Created', data });
		});
	} catch (err) {
		console.log('err', err);
		return res
			.status(500)
			.json({ status: false, message: 'Something went Wrong' });
	}
});

app.post('/teachers/add', (req, res) => {
	try {
		const batchData = { id: uuid(), name: req.body.name };
		console.log('teachers/add', batchData);

		connection.query('INSERT INTO teachers SET ?', batchData, (err, data) => {
			console.log('err', err);

			if (err)
				return res.status(400).json({
					status: false,
					message: 'Teacher Addition Failed',
					err: err,
				});
			return res.json({ status: true, message: 'Teachers Added', data });
		});
	} catch (err) {
		console.log('err', err);
		return res
			.status(500)
			.json({ status: false, message: 'Something went Wrong' });
	}
});
app.post('/classroom/add', (req, res) => {
	try {
		let { startTime, endTime } = req.body;
		startTime = startTime.replace('T', ' ');
		endTime = endTime.replace('T', ' ');
		const batchData = {
			id: uuid(),
			...req.body,
			startTime,
			endTime,
			date: startTime.slice(0, 10),
		};
		console.log('teachers/add', batchData);

		connection.query('INSERT INTO Classroom SET ?', batchData, (err, data) => {
			console.log('err', err);

			if (err)
				return res.status(400).json({
					status: false,
					message: 'Class Addition Failed',
					err: err,
				});
			return res.json({ status: true, message: 'Class Added', data });
		});
	} catch (err) {
		console.log('err', err);
		return res
			.status(500)
			.json({ status: false, message: 'Something went Wrong' });
	}
});
// Get All Tables Data++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/batch/all', (req, res) => {
	try {
		connection.query('Select * from BATCH', (err, data) => {
			console.log('err', err);

			if (err)
				return res.status(400).json({
					status: false,
					message: 'Batch Fetching Failed',
					err: err,
				});
			return res.json({ status: true, message: 'All Batches Fetched', data });
		});
	} catch (err) {
		console.log('err', err);
		return res
			.status(500)
			.json({ status: false, message: 'Something went Wrong' });
	}
});

app.get('/teachers/all', (req, res) => {
	try {
		connection.query('Select * from Teachers', (err, data) => {
			console.log('err', err);

			if (err)
				return res.status(400).json({
					status: false,
					message: 'Batch Fetching Failed',
					err: err,
				});
			return res.json({ status: true, message: 'All Batches Fetched', data });
		});
	} catch (err) {
		console.log('err', err);
		return res
			.status(500)
			.json({ status: false, message: 'Something went Wrong' });
	}
});

app.get('/classroom/all', (req, res) => {
	try {
		connection.query('Select * from Classroom', (err, data) => {
			console.log('err', err);

			if (err)
				return res.status(400).json({
					status: false,
					message: 'Batch Fetching Failed',
					err: err,
				});
			return res.json({ status: true, message: 'All Batches Fetched', data });
		});
	} catch (err) {
		console.log('err', err);
		return res
			.status(500)
			.json({ status: false, message: 'Something went Wrong' });
	}
});

app.post('/classroom/date', (req, res) => {
	try {
		console.log('classroom.req', req.body);
		connection.query(
			'Select * from Classroom where date=?',
			req.body.date,
			(err, data) => {
				if (err)
					return res.status(400).json({
						status: false,
						message: 'Classroom Fetching Failed',
						err: err,
					});
				return res.json({
					status: true,
					message: 'All Classroom Fetched',
					data,
				});
			}
		);
	} catch (err) {
		console.log('err', err);
		return res
			.status(500)
			.json({ status: false, message: 'Something went Wrong' });
	}
});
app.post('/classroom/dates', (req, res) => {
	try {
		// order by game_date desc;
		console.log('classroom.req', req.body);
		connection.query(
			`select * from CLASSROOM 
				where date between ? and ?
				`,
			[req.body.startDate, req.body.endDate],
			(err, data) => {
				if (err)
					return res.status(400).json({
						status: false,
						message: 'Classroom Fetching Failed',
						err: err,
					});
				return res.json({
					status: true,
					message: 'All Classroom Fetched',
					data,
				});
			}
		);
	} catch (err) {
		console.log('err', err);
		return res
			.status(500)
			.json({ status: false, message: 'Something went Wrong' });
	}
});
// Server Connection ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.get('/drop', (req, res) => {
	const sql = `DROP TABLE classroom`;

	connection.query(sql, (err, data) => {
		if (err) return res.json({ status: false, err: err });
		return res.json({ status: true, message: 'Done', data });
	});
});
app.get('/func', (req, res) => {
	const sql = `DROP TABLE classroom`;

	connection.query(sql, (err, data) => {
		if (err) return res.json({ status: false, err: err });
		return res.json({ status: true, message: 'Done', data });
	});
});

// Server Connection ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.get('/', (req, res) => {
	return res.send('Hello to Batch Manage Pro');
});

app.listen(PORT, () => {
	console.log('server running');
});
