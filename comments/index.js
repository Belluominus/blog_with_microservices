import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto'

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    
    res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    const commentId = randomBytes(4).toString('hex');
    
    const comments = commentsByPostId[id] || [];

    comments.push({ id:commentId, content });

    commentsByPostId[id] = comments;

    res.status(201).send(comments);
});

app.listen(4001, () => {
    console.log('listening on 4001')
});