import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CafeIcon from '@material-ui/icons/LocalCafe';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Copyright from './Components/Copyright';
import IconButton from '@material-ui/core/IconButton';
import { TextField } from "@material-ui/core";

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

export default function Main(props) {
    const classes = useStyles();
    const [email, setEmail] = React.useState("")

    return (
        <React.Fragment>
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
                            Coffee Survey
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Want to know where people of Melbourne like to go for coffee?
                            Take part in this survey to know more.
                        </Typography>
                        <form className={classes.form} onSubmit={(event) => {
                            event.preventDefault()
                            props.history.push("submitsurvey/" + email)
                        }}>
                            <Grid container spacing={2} justify="center">
                                <Grid item md={8} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={email}
                                        required
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Button fullWidth variant="outlined" color="primary" size="large" type="submit">
                                        Take Part
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Container>
                </div>
            </main>
            <footer className={classes.footer}>
                <Copyright />
            </footer>
        </React.Fragment>
    );
}