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
import Chart from 'react-google-charts';
import Copyright from './Components/Copyright';
import IconButton from '@material-ui/core/IconButton';
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
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
}));

export default function Report(props) {
    const classes = useStyles();
    const [isLoading, SetLoading] = React.useState(true)
    var [results, setResults] = React.useState({
        preferenceReport: {},
        genderReport: {},
        brandReport: {}
    })
    React.useEffect(() => {
        if (isLoading) {
            APIRequest(`
                    query {
                        genderReport {
                            error {
                                code
                                msg
                            }
                            Male 
                            Female
                            Unknown
                        }
                        preferenceReport {
                            error {
                                code
                                msg
                            }
                            AtHome
                            CoffeeSpecialists
                            OutWithFriends
                        }
                        brandReport {
                            error {
                                code
                                msg
                            }
                            StarBucks
                            GloriaJeans
                            SevenEleven
                            EZYMart
                            IndustryBeans
                            PatriciaCoffeeBrewers
                            DukesCoffeeRoasters
                        }
                    }
                `).then((r) => r.json()).then(d => {
                if (d.data) {
                    if (d.data.preferenceReport.error)
                        console.error(d.data.preferenceReport.error)
                    if (d.data.genderReport.error)
                        console.error(d.data.genderReport.error)
                    if (d.data.brandReport.error)
                        console.error(d.data.brandReport.error)

                    SetLoading(false)

                    setResults({
                        preferenceReport: d.data.preferenceReport,
                        genderReport: d.data.genderReport,
                        brandReport: d.data.brandReport
                    })

                } else {
                    console.error(d)
                    SetLoading(false)
                }
            }).catch((error) => {
                console.error(error)
                SetLoading(false)
            })
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
                    <Container>
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Coffee Survey Report - Melbourne
                        </Typography>
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={12} sm={6}>
                                <Chart
                                    chartType="BarChart"
                                    height="60vh"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Coffee Consumption', "Male", "Female", "Unknown"],
                                        ["", results.genderReport.Male * 100, results.genderReport.Female * 100, results.genderReport.Unknown * 100]
                                    ]}
                                    options={{
                                        title: 'Male Vs Female',
                                        hAxis: {
                                            title: '% Consuming Coffee',
                                            minValue: 0,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Chart
                                    height="60vh"
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Preferred Place', 'No. of People'],
                                        ['At Home', results.preferenceReport.AtHome],
                                        ['Coffee Specialists', results.preferenceReport.CoffeeSpecialists],
                                        ['Out With Friends', results.preferenceReport.OutWithFriends],
                                    ]}
                                    options={{
                                        legend: 'none',
                                        pieSliceText: 'label',
                                        title: 'Preferred Place for Coffee',
                                        pieStartAngle: 0,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8} >
                                <Chart
                                    chartType="BarChart"
                                    loader={<div>Loading Chart</div>}
                                    height="60vh"
                                    data={[
                                        ['Brands', "In Melbourne"],
                                        ["Star Bucks", results.brandReport.StarBucks],
                                        ["Gloria Jeans", results.brandReport.GloriaJeans],
                                        ["7 Eleven", results.brandReport.SevenEleven],
                                        ["EZY Mart", results.brandReport.EZYMart],
                                        ["Industry Beans", results.brandReport.IndustryBeans],
                                        ["Patricia Coffee Brewers", results.brandReport.PatriciaCoffeeBrewers],
                                        ["Dukes Coffee Roasters", results.brandReport.DukesCoffeeRoasters],
                                    ]}
                                    options={{
                                        title: 'Coffee Shops Preferred',
                                        hAxis: {
                                            title: 'No of People',
                                            minValue: 0,
                                        },
                                        legend: { position: 'none' },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            </main>
            <footer className={classes.footer}>
                <Copyright />
            </footer>
        </LoadingScreen>
    );
}