import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CommentCreate } from "./CommentCreate"
import { CommentList } from "./CommentList"
function PostList() {
    const [ posts, setPosts ] = useState({});

    async function fetchPosts() {
        const { data } = await axios.get('http://localhost:4002/posts');

        setPosts(data);
    };

    useEffect(() =>{
        fetchPosts();
    },[]);

    const renderPosts = Object.values(posts).map(post => {
        return <div 
            className="card" 
            style={{ width: '30%', marginBottom: '20px' }}
            key={post.id}
        >
            <div className='card-body'>
                <h3>{post.title}</h3>
                
                <hr />
                <CommentList comments={post.comments} />
                <CommentCreate postId={post.id} />
            </div>
        </div>
    })

    return(
        <div className='d-flex flex-row flex-wrap justify-content-between'>
            {renderPosts}
        </div>
    );
};

export { PostList };