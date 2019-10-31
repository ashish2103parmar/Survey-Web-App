import React from "react"
import LoadingScreen from 'react-loading-screen';
import { validateEmail } from "./js/util";
import { Redirect } from 'react-router-dom'
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
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import APIRequest from "./js/APIRequest";


const useStyles = makeStyles(theme => ({
    title: {
        flexGrow: 1,
    },
    headerContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    form: {
        marginTop: theme.spacing(4),
    },
    formControl: {
        marginLeft: theme.spacing(3),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
}));

function formatValue(label, value) {
    return { label, value }
}

const CoffeeBrands = [
    formatValue("Star Bucks", "StarBucks"),
    formatValue("Gloria Jeans", "GloriaJeans"),
    formatValue("7 Eleven", "SevenEleven"),
    formatValue("EZY Mart", "EZYMart"),
    formatValue("Industry Beans", "IndustryBeans"),
    formatValue("Patricia Coffee Brewers", "PatriciaCoffeeBrewers"),
    formatValue("Dukes Coffee Roasters", "DukesCoffeeRoasters"),
]

const PreferredPlace = [
    formatValue("At Home", "AtHome"),
    formatValue("Coffee Specialists", "CoffeeSpecialists"),
    formatValue("Out With Friends", "OutWithFriends"),
]

export default function Submit(props) {
    const classes = useStyles();
    const email = props.match.params.email;
    const [isLoading, SetLoading] = React.useState(true)

    const defaultEntry = {
        name: "",
        ageGroup: "A_19_25",
        gender: "Unknown",
        drinkCoffee: false,
        preferredPlace: "PlaceNone",
        preferredShop: "ShopNone"
    }

    const [entry, setEntry] = React.useState(defaultEntry)

    const handleChange = (name) => (event) => {
        setEntry({ ...entry, [name]: event.target.value })
    }


    React.useEffect(() => {
        if (validateEmail(email) && isLoading) {
            APIRequest(`
                query CheckAlreadyPart($email: String!) {
                    isPartOfSurvey(email: $email)
                }
            `, {
                email
            }).then((r) => r.json()).then(d => {
                if (d.data) {
                    if (d.data.isPartOfSurvey) {
                        props.history.push("/surveyreport")
                    } else {
                        SetLoading(false)
                    }
                } else {
                    console.error(d)
                }
            }).catch((error) => {
                console.error(error)
            })
        }
    }, [email, props.history])

    if (validateEmail(email)) {

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
                                Coffee Survey
                            </Typography>
                            {/*<Typography variant="h5" align="center" color="textSecondary" paragraph>
                                Want to know where people of Melbourne like to go for coffee?
                                Take part in this survey to know more.
                            </Typography>*/}
                            <form className={classes.form} onSubmit={(event) => {
                                event.preventDefault()
                                SetLoading(true)
                                APIRequest(`
                                        mutation SubmitSurvey($email: String!, $entry: Survey!) {
                                            submitSurvey(email: $email, survey: $entry) {
                                                code
                                                msg
                                            }
                                        }
                                    `, {
                                    email,
                                    entry
                                }).then((r) => r.json()).then(d => {
                                    if (d.data) {
                                        if (d.data.submitSurvey) {
                                            console.error(d.data.submitSurvey)
                                            SetLoading(false)
                                        } else {
                                            props.history.push("/surveyreport")
                                        }
                                    } else {
                                        console.error(d)
                                        SetLoading(false)
                                    }
                                }).catch((error) => {
                                    console.error(error)
                                    SetLoading(false)
                                })
                            }}>
                                <Grid container spacing={2} justify="center">
                                    <Grid item xs={12} md={9}>
                                        <FormControl component="fieldset" fullWidth required>
                                            <FormLabel component="legend">Name</FormLabel>
                                            <TextField
                                                fullWidth
                                                name="name"
                                                value={entry.name}
                                                onChange={handleChange("name")}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <FormControl component="fieldset" required>
                                            <FormLabel component="legend">Age Group</FormLabel>
                                            <RadioGroup value={entry.ageGroup} onChange={handleChange("ageGroup")} color="primary" row className={classes.formControl}>
                                                <FormControlLabel value="A_19_25" control={<Radio color="primary" />} label=">19 <25" />
                                                <FormControlLabel value="B_26_32" control={<Radio color="primary" />} label=">26 <32" />
                                                <FormControlLabel value="C_33_Above" control={<Radio color="primary" />} label=">33 & above" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <FormControl component="fieldset" required>
                                            <FormLabel component="legend">Gender</FormLabel>
                                            <RadioGroup value={entry.gender} onChange={handleChange("gender")} row className={classes.formControl}>
                                                <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
                                                <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
                                                <FormControlLabel value="Unknown" control={<Radio color="primary" />} label="Don't want to Disclose" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <FormControl component="fieldset" required>
                                            <FormLabel component="legend">Do you drink coffee?</FormLabel>
                                            <RadioGroup value={entry.drinkCoffee ? "Yes" : "No"} onChange={(event) => {
                                                setEntry({ ...entry, drinkCoffee: event.target.value === "Yes" })
                                            }} row className={classes.formControl}>
                                                <FormControlLabel value="Yes" control={<Radio color="primary" />} label="Yes" />
                                                <FormControlLabel value="No" control={<Radio color="primary" />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">Where do you drink coffee?</FormLabel>
                                            <RadioGroup value={entry.preferredPlace} onChange={handleChange("preferredPlace")} className={classes.formControl}>
                                                {
                                                    PreferredPlace.map((brand, idx) => <FormControlLabel key={idx} value={brand.value} control={<Radio color="primary" disabled={!entry.drinkCoffee} />} label={brand.label} />)
                                                }
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">Which is the most preferred coffee shop for you?</FormLabel>
                                            <RadioGroup value={entry.preferredShop} onChange={handleChange("preferredShop")} className={classes.formControl}>
                                                {
                                                    CoffeeBrands.map((brand, idx) => <FormControlLabel key={idx} value={brand.value} control={<Radio color="primary" disabled={!entry.drinkCoffee} />} label={brand.label} />)
                                                }
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button fullWidth variant="outlined" color="primary" size="large" type="submit">
                                            Submit
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
            </LoadingScreen>
        );
    }
    else
        return (
            <Redirect to="/" />
        )
}