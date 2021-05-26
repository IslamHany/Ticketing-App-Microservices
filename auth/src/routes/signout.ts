import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    req.session = null; //tell the browser to dump the cookie
    res.send({});
});

export {router as signoutRouter};