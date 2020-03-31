
import Axios from 'axios';
import {Container, Inject} from 'typedi';
import {Logger} from 'winston';
import fbAdmin from 'firebase-admin';

import ConfigClass from '../../config/config.dto';
import ErrorResponse from '../../exceptions/ErrorResponse';

let serviceAccount = 'TEMP'; //require('../../../APIKEY_FIREBASE_ACCOUNT/allthatkorea-5bfcd-a2859e897ba8');
let APIKEY_FIREBASE_PROJECT_NAME = 'TEMP'; //require('../../../APIKEY_FIREBASE_ACCOUNT/allthatkorea-5bfcd-a2859e897ba8');

// fbAdmin.initializeApp({
//     credential: fbAdmin.credential.cert(serviceAccount),
//     databaseURL: `https://${APIKEY_FIREBASE_PROJECT_NAME}.firebaseio.com`
// });


type optionType = {method: string, url: string, headers?: {Authorization: string}}

export default class LoginAuthCheck {

    @Inject()
    private Config: ConfigClass;
    @Inject()
    private logger: Logger;

    private options: optionType;

    constructor(private joinType: string){
        return this;
    }

    public authorizeToken(loginId: string, accessToken: string){
        switch (this.joinType) {
            case 'KAKAO':
                return this.kakaoAuth(accessToken);
                break;
            case 'NAVER':
                return this.naverAuth(accessToken);
                break;
            case 'GOOGLE':
                return this.googleAuth(loginId, accessToken);
                break;
            case 'FACEBOOK':
                return this.facebookAuth(accessToken);
                break;
            default:
                throw new ErrorResponse(400, 'authType Error', '400');
        }

    }

    // =================================================================

    private async kakaoAuth (accessToken: string): Promise<boolean> {
        this.options = {
            method: 'get',
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {Authorization: `Bearer ${accessToken}`}
        };

        return await this.requestAuth();
    }

    private async naverAuth (accessToken: string): Promise<boolean> {
        this.options = {
            method: 'get',
            url: "https://openapi.naver.com/v1/nid/me",
            headers: {Authorization: `Bearer ${accessToken}`}
        };

        return await this.requestAuth();
    }

    private async googleAuth (loginId: string, accessToken: string): Promise<boolean> {
        return await fbAdmin.auth().getUser(accessToken)
            .then((userRecord: fbAdmin.auth.UserRecord) => {
                if (userRecord.providerData[0].uid !== loginId){
                    return false;
                }

                return true;

            })
            .catch((err: Error)=>{
                console.log(err);
                this.logger.error(err.message);
                return false;
            });
        // this.options = {
        //     method: 'get',
        //     url: `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${encodeURIComponent(accessToken)}`,
        // };
        //
        // return await this.requestAuth();
    }

    private async facebookAuth (accessToken: string): Promise<boolean> {
        const baseUrl: string = "https://graph.facebook.com";

        // @ts-ignore
        let serviceToken = await Axios({
            method: 'get',
            url: `${baseUrl}/oauth/access_token?client_id=${this.Config.facebookId}&client_secret=${this.Config.facebookSecret}&grant_type=client_credentials`,
        })
            .then((response: any)=>{
                return response.data.access_token;

            })
            .catch((err: Error)=>{
                this.logger.error('Facebook service setting Error: APIKEY_FB');
                console.log(err);
                return false;

            });

        if(serviceToken !== false){
            return await Axios({
                method: 'GET',
                url: `${baseUrl}/debug_token?input_token=${accessToken}&access_token=${serviceToken}`
            })
                .then((response: any)=>{
                    if(response.data.error){
                        return false;
                    }

                    return true;

                })
                .catch((err: Error)=>{
                    console.log(err);
                    this.logger.error(err.message);
                    return false;

                })
        }else{
            return false;

        }

    }

    // =================================================================

    private requestAuth (): Promise<boolean> {
        // @ts-ignore
        return Axios(this.options)
            .then((response: any)=>{
                if(response.statusCode !== 200){
                    return false;
                }

                return true;

            })
            .catch((err: Error)=>{
                console.log(err);
                this.logger.error(err.message);
                return false;

            });

    }

}

