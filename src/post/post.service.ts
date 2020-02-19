import RequestWithUser from "../interfaces/requestWithUser.interface";
import * as express from "./post.controller";
import CreatePostDto from "./post.dto";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import Post from "./post.entity";

import { Service } from 'typedi';

@Service
class PostService {
    constructor();

    public createPost = async (request: RequestWithUser, response: express.Response) => {
        const postData: CreatePostDto = request.body;
        const newPost = this.postRepository.create({
            ...postData,
            author: request.user,
        });
        await this.postRepository.save(newPost);
        newPost.author = undefined;
        response.send(newPost);
    }

    public  getAllPosts = async (request: express.Request, response: express.Response) => {
        const posts = await this.postRepository.find({ relations: ['categories'] });
        response.send(posts);
    }

    public  getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const post = await this.postRepository.findOne(id, { relations: ['categories'] });
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    public  modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const postData: Post = request.body;
        await this.postRepository.update(id, postData);
        const updatedPost = await this.postRepository.findOne(id);
        if (updatedPost) {
            response.send(updatedPost);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    public  deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.postRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default
