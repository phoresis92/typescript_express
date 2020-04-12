import argon2 from 'argon2';
import {createHash} from 'crypto';
import {Request} from 'express';
import moment = require('moment');
import * as uuid from 'uuid';
import jwt from 'jsonwebtoken';
import redis, {RedisClient, print} from 'redis';
import {Container, Service, Inject} from 'typedi';
import {promisify} from 'util';
import TokenInterface from '../../interfaces/token.interface';

import UtilsClass from '../../utils/utils';

import ConfigClass from '../../config/config.dto';

import AuthDAOClass from '../auth/auth.dao';
import UserDAOClass from './user.dao';

import ProfileDtoClass from './dto/profile.dto';

import SnsAuthCheck from '../../utils/externalApi/SnsAuthCheck';

import ErrorResponse from "../../utils/response/ErrorResponse";

@Service('UserService')
export default class UserService {

    @Inject()
    private Config: ConfigClass;
    @Inject()
    private AuthDAO: AuthDAOClass;
    @Inject()
    private UserDAO: UserDAOClass;
    @Inject('redis')
    private Redis: RedisClient;

    constructor() {};

    public updateProfileService = async (ProfileDto: ProfileDtoClass, token: TokenInterface): Promise<any> => {

        /** User Check **/
        const userData = await this.AuthDAO.getUserByUserId(token.userId);
        {
            if (!userData) {
                throw new ErrorResponse(404, "User not exist", '01');
                return;
            }

            if(userData.user_status !== 50){
                throw new ErrorResponse(404, "Bad user status", '02');
                return;
            }
        }

        /** Update User **/
        const updateProfileResult = await this.UserDAO.updateProfile(ProfileDto, token);

        return updateProfileResult;

    };

}
