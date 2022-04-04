import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { type, data }= req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://localhost:4005/events', {
            type: "CommentUpdated",
            data: {
                id: data.commentId, 
                content: data.content,
                postId: data.id,
                status
            }
        });
    };

    res.send({});
});

app.listen(4003, () => {
    console.log('listening on 4003')
});