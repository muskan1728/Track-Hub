import React from 'react'

function LoadState() {
    const [state, setState] = useState(loadStateFromLocalStorage() || initialState);

    useEffect(() => {
        saveStateToLocalStorage(state);
    }, [state]);
    const saveStateToLocalStorage = state => {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem('state', serializedState);
        } catch (err) {
            console.error(err);
        }
    };
    const loadStateFromLocalStorage = () => {
        try {
            const serializedState = localStorage.getItem('state');
            if (serializedState === null) {
                return undefined;
            }
            return JSON.parse(serializedState);
        } catch (err) {
            console.error(err);
            return undefined;
        }
    };
    return (
<></>    )
}

export default LoadState