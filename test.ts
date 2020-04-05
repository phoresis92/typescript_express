import * as uuid from 'uuid';

console.log(uuid.v4())
console.log(uuid.v4().length)

import Utils from './src/utils/utils';



console.log(new Utils().makeUserId())
