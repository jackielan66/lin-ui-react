import * as React from 'react';
import { useRef, createRef } from 'react';

export default function useRefs() {
    const cacheRefs = useRef(new Map());

    function getRef(key) {
        if (!cacheRefs.current.get(key)) {
            cacheRefs.current.set(key, createRef());
        }
        return cacheRefs.current.get(key);
    }

    function removeRef(key) {
        cacheRefs.current.delete(key);
    }

    return [getRef, removeRef];
}
