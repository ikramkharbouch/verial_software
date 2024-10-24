import { PropsWithChildren, useRef } from "react";

type LazyProps = {
    visible: boolean;
}

export default function Lazy({visible, children}: PropsWithChildren<LazyProps>) {
    const rendered = useRef(visible);

    if (visible && !rendered.current) {
        rendered.current = true;
    }

    if (!rendered.current)
        return null;

    return <div style={{display: visible ? 'block' : 'none'}}>{children}</div>;
}
