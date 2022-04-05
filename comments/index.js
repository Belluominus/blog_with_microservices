import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto'
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

const handleEvent = async (type, data) => {
    if(type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => comment.id === id );

        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: "CommentUpdated",
            data: {
                id, 
                content,
                postId,
                status
            }
        })
    }
};

app.get('/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    
    res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    const commentId = randomBytes(4).toString('hex');
    
    const comments = commentsByPostId[id] || [];

    comments.push({ id:commentId, content, status: 'pending' });

    commentsByPostId[id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: "CommentCreated",
        data: {
            id:commentId, 
            content,
            postId: id,
            status: 'pending'
        }
    })

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type);

    const { type, data }= req.body;

    handleEvent(type, data)

    res.send({});
});

app.listen(4001, async () => {
    console.log('listening on 4001')
    try {
        const {data} = await axios.get("http://localhost:4005/events");
     
        for (let event of data) {
          console.log("Processing event:", event.type);
     
          handleEvent(event.type, event.data);
        }
      } catch (error) {
        console.log(error.message);
      }
});