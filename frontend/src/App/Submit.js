import React from "react"
import LoadingScreen from 'react-loading-screen';
import { validateEmail } from "./js/util";
import { Redirect } from 'react-router-dom'

export default function Submit(props) {
    const email = props.match.params.email;
    const [isLoading, SetLoading] = React.useState(true)

    React.useEffect(() => {
        if (validateEmail(email) && isLoading) {
            
            SetLoading(false)
        }
    }, [email, isLoading])

    if (validateEmail(email)) {

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
    else
        return (
            <Redirect to="/" />
        )
}