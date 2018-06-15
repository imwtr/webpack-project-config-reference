// 允许热替换
if (module.hot) {
    module.hot.accept();
}

import 'babel-polyfill';
import {showMsg} from './components/util';
import '../scss/detail.scss';

console.log('Detail: ');

showMsg();

let gen = function* () {
    yield 1;
    yield 2;
    yield 3;
};

console.log([...gen()]);

console.log(Array.from([1,2,32]))
console.log(jQuery('.header__img').length)
