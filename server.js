import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config.js';
import path from 'path';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import passport from 'passport';

import { PORT, URI, SECRET } from './api/config/config.js';

import auth from './api/routes/auth.js';
import register from './api/routes/register.js';

import User from './api/models/user.js';

const MongoStore = connectMongo(session);

mongoose
	.connect(URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('local database connected in port: 27017');
	})
	.catch(err => {
		console.error(err);
	});

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: SECRET,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.get('/api', (req, res) => {
	res.send('hello world');
});

app.use('/api', auth);
app.use('/api/register', register);

app.listen(PORT, () => {
	console.log(`server running on port: ${PORT}`);
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/public'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
	});
}
