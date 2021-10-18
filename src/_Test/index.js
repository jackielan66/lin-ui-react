import React from 'react';
import Child from './Child';

// class Child extends React.PureComponent {
//     render() {
//         console.log('I am rendering');
//         console.log(this.props, 'this.props');

//         return (
//             <div>
//                 I am update every
//                 {' '}
//                 {this.props.seconds}
//                 {' '}
//                 seconds
//             </div>
//         );
//     }
// }

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                date: new Date(),
            });
        }, 1000);
    }

    render() {
        return (
            <div>
                <Child seconds={1} />
                <div>{this.state.date.toString()}</div>
            </div>
        );
    }
}
