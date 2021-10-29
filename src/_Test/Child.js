import React from 'react';
import { saveSvgAsPng } from 'save-svg-as-png';

//

// function Itest() {
//     this.data = [];
// }

// const obj = null;
function Single() {

}

// eg 1
// Single.getInstance = function () {
//     if (!this.instance) {
//         this.instance = new Single();
//     }
//     return this.instance;
// };

// eg 2
Single.getInstance = (function () {
    let instance = null;
    return function () {
        if (instance == null) {
            instance = new Single();
        }
        return instance;
    };
}());

// const testA = Single();
// const tB = Single();
// console.log(testA, 'testA');

// console.log(testA === tB);

function Child({ seconds }) {
    console.log('I am rendering');

    const download = () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttributeNS(null, 'width', 600);
        svg.setAttributeNS(null, 'height', 600);
        svg.setAttributeNS(null, 'viewBox', `0 0 ${600} ${300}`);
        saveSvgAsPng(svg, `${'svg tranosform png'}.png`, {
            // fonts: [],
        });
    };

    return (
        <div>
            I am update every
            {' '}
            {seconds}
            {' '}
            seconds
            <button onClick={download}>download</button>
        </div>
    );
}

export default Child;
