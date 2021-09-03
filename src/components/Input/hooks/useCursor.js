import { useRef } from 'react';

export default function useCursor(input, focused) {
    const selectionRef = useRef();

    console.log('const selectionRef = useRef', input);

    return [() => { }, () => { }];
}
