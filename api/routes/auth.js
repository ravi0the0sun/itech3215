import { Router } from 'express';
import passport from 'passport';
import User from '../models/user.js';

const auth = Router();

auth.get('/user', async (req, res) => {
	if (req.user) {
		return res.json(extractUser(req));
	} else {
		return res.json({ user: null });
	}
});

auth.post('/logout', async (req, res) => {
	if (req.user) {
		req.logOut();
		res.json({ message: 'logout' });
	} else {
		res.json({ message: 'no user to logout' });
	}
});

auth.post('/login', passport.authenticate('local'), (req, res) => {
	res.json(extractUser(req));
});

function extractUser(req) {
	const { username, _id } = req.user;
	return { user: { username, _id } };
}

export default auth;
