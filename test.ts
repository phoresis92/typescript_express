import argon2 from 'argon2';
import Axios from 'axios';
import { randomBytes, createHash } from 'crypto'

const password = 'WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=';


(async () => {

    let salt = randomBytes(32);
    const hashedPassword = await argon2.hash(password, { salt });

    const saltHex = salt.toString('hex');


    console.log(salt)
    console.log(hashedPassword)
    console.log(saltHex)

    const validPassword = await argon2.verify(hashedPassword, password);

    console.log(validPassword)

})();


    let options = {
        method: 'get',
        url: `https://graph.facebook.com/oauth/access_token?client_id=${'553963215373018'}&client_secret=${'2109c675ce27b986a269f12df5d7096f'}&grant_type=client_credentials`,
    };


    // @ts-ignore
    Axios(options)
        .then((response: any)=>{
            console.log(response)
            console.log(response.data)
            console.log(response.data.access_token)
            if(response.statusCode !== 200){
                return false;
            }

            return true;
        })
        .catch((err: Error)=>{
            return false;
        });

