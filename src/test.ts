import path from 'path';

// @ts-ignore
global.__basedir = path.resolve('../');

console.log(__dirname);

// @ts-ignore
console.log(__basedir);
console.log(process.cwd());
console.log(path.join(__dirname, '..'));
