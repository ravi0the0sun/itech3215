import { Router } from 'express';
import passport from 'passport';
import User from '../models/user.js';

const register = Router();

register.get('/', (req, res) => {
	res.send('register route');
});

register.post(
	'/',
	async (req, res, next) => {
		const { username, password } = req.body;
		try {
			await User.register({ username }, password);
		} catch (error) {
			if (error.name === 'userExistError') {
				return res.status(400).json({ message: 'UserExistError' });
			}
			return res.status(500).json({ message: 'ServerError' });
		}
		next();
	},
	passport.authenticate('local'),
	(req, res) => {
		return res.json({ user: { username: req.user.username } });
	}
);

export default register;
