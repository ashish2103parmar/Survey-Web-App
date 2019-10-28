import React from "react"
import LoadingScreen from 'react-loading-screen';

export default function Report(props) {
    const [isLoading, SetLoading] = React.useState(true)

    React.useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                SetLoading(false)
            }, 500)
        }
    }, [isLoading])

    return (
        <LoadingScreen
            loading={isLoading}
            bgColor='#f1f1f1'
            spinnerColor='#9ee5f8'
            textColor='#565656'
            text='Loading...'
        >
            Hello
        </LoadingScreen>
    );
}