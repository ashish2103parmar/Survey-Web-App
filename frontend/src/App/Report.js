import React from "react"
import LoadingScreen from 'react-loading-screen';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CafeIcon from '@material-ui/icons/LocalCafe';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Copyright from './Components/Copyright';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
    title: {
        flexGrow: 1,
    },
    headerContent: {
        backgroundColor: theme.palette.background.paper,
        height: "90vh",
        minHeight: "500px",
        padding: theme.spacing(8, 0, 6),
    },
    form: {
        marginTop: theme.spacing(4),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
}));

export default function Report(props) {
    const classes = useStyles();
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
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" onClick={() => props.history.push('/')} >
                        <CafeIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap className={classes.title}>
                        Coffee Group
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <div className={classes.headerContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Coffee Survey Report
                        </Typography>
                        {/*<Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Want to know where people of Melbourne like to go for coffee?
                            Take part in this survey to know more.
                        </Typography>*/}
                    </Container>
                </div>
            </main>
            <footer className={classes.footer}>
                <Copyright />
            </footer>
        </LoadingScreen>
    );
}