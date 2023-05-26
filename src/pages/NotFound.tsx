import * as React from "react";

const NotFound = () => {
    React.useEffect(() => {
        document.title = '404 error';
    }, []);
    return (<h1>404 Not Found</h1>)
}

export default NotFound;