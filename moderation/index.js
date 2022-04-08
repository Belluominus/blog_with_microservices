import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

const handleEvent = async (type, data) => {
    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
    
        await axios.post('http://event-bus-srv:4005/events', {
            type: "CommentModerated",
            data: {
                id: data.id, 
                content: data.content,
                postId: data.postId,
                status
            }
        });
    };
};

app.post('/events', async (req, res) => {
    const { type, data }= req.body;

    handleEvent( type, data )

    res.send({});
});

app.listen(4003, async () => {
    console.log('listening on 4003')
    try {
        const {data} = await axios.get("http://event-bus-srv:4005/events");
     
        for (let event of data) {
          console.log("Processing event:", event.type);
     
          handleEvent(event.type, event.data);
        }
      } catch (error) {
        console.log(error.message);
      }
});