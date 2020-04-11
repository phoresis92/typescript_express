import moment from 'moment';
import * as uuid from 'uuid';

console.log(uuid.v4())
console.log(uuid.v4().length)

import Utils from './src/utils/utils';



console.log(new Utils().makeUserId())

let d = new Date('2020-04-01 13:56:32');

console.log(d.getDate())
console.log(d.getHours())
console.log(d.getMinutes())
console.log(d.getSeconds())
console.log(moment(d).format('YYYY-MM-DD HH:mm:ss'))
console.log(moment('2020-04-01 15:00:00') <= moment('2020-04-03 17:00:00').add(1, 'day'))
console.log(moment('2020-04-03 17:00:00').add(1, 'day').format('YYYY-MM-DD HH:mm:ss'))
