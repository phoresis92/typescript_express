import * as express from 'express';
import { getRepository } from 'typeorm';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import Post from './post.entity';

import success from '../utils/Success'

// import { celebrate, Joi } from 'celebrate';
// import { Container } from 'typedi';


class PostController implements Controller {
  public path = '/posts';
  public router = express.Router();
  private postRepository = getRepository(Post);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, /*authMiddleware,*/ validationMiddleware(CreatePostDto), this.createPost);
  }

  private createPost = async (request: RequestWithUser, response: express.Response) => {
    // const logger = Container.get('logger');
    const postData: CreatePostDto = request.body;
    const newPost = this.postRepository.create({
      ...postData,
      author: request.user,
    });
    await this.postRepository.save(newPost);
    newPost.author = undefined;
    response.send(newPost);
  }

  private getAllPosts = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
    const posts = await this.postRepository.find({ relations: ['categories'] });
    response.send(new success(request.params, next, posts, 1, `wowowoww`).resultObj());

    }catch(e){
      console.log(e)
      return e;
    }

  }

  private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log(request.body)
    console.log(request.params)
    console.log(request.query)
    const id = request.params.id;
    const post = await this.postRepository.findOne(id, { relations: ['categories'] });
    if(!post){
      next(new PostNotFoundException(id));
      return;
    }
      response.send(new success(request.params, next, post, 1, `here?`).resultObj());

  }

  private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
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

  private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const deleteResponse = await this.postRepository.delete(id);
    if (deleteResponse.raw[1]) {
      response.sendStatus(200);
    } else {
      next(new PostNotFoundException(id));
    }
  }
}

export default PostController;

