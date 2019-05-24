import React from 'react'
import fetch from 'isomorphic-unfetch'

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Router from 'next/router'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from 'universal-cookie';


const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	paper: theme.mixins.gutters({
		textAlign: 'center',
		width: '80vw',
		paddingTop: 16,
		paddingBottom: 16,
		margin: '0 auto',
		marginTop: theme.spacing.unit * 5,
		marginBottom: theme.spacing.unit * 5,
		[theme.breakpoints.down('sm')]: {
			width: '100vw',
			marginTop: theme.spacing.unit * 3,
			marginBottom: theme.spacing.unit * 3,
		},
	}),
	title: {
		marginBottom: theme.spacing.unit * 3,
		lineHeight: '5rem',
		[theme.breakpoints.down('sm')]: {
			fontSize: '2rem',
			lineHeight: '2.3rem',
			marginBottom: theme.spacing.unit * 1,
		}
	},
	area: {
		margin: '0 auto',
		marginTop: '4rem',
		maxWidth: '42rem',
		padding: '2rem',
		[theme.breakpoints.down('sm')]: {
			padding: '1rem',
			marginTop: '2rem',
		},
	},
	text: {
		marginBottom: '1rem',
	},
	mistake: {
		marginTop: '2rem',
	},
	textField: {
		marginBottom: '2rem',
	},
	ticketIdLink: {
		display: 'inline-block',
		paddingLeft: '1rem'
	},
	modal: {
		width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing.unit * 4,

		[theme.breakpoints.down('sm')]: {
			width: '100vw'
		}
	},
	retry: {
		marginTop: '-1rem',
		marginBottom: '1rem',
	},
	card: {
		position: 'absolute',
		outline: 'none',
		width: theme.spacing.unit * 50,
		boxShadow: theme.shadows[5],
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		[theme.breakpoints.down('sm')]: {
			width: '100vw'
		}
	},
	helpText: {
		marginBottom: '1rem',
	},
	media: {
		height: 110,
		[theme.breakpoints.down('sm')]: {
			height: 90,
			marginBottom: '1rem',
		}
	},
});

const login = async (id) => {
	return fetch(`/api/login`,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id
			})
		})
		.then(response => {
			if (response.status !== 200) {
				throw new Error('Unauthorized');
			}
			return response
		})
		.then(response => response.json())
}

//import styles from './styles.scss'

class Index extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			ticketId: '',
			modalOpen: false,
			error: false,
			loading: false,
		}
	}

	async onSubmit (e) {
		e.stopPropagation();
		e.preventDefault();

		this.setState({
			error: false,
			loading: true
		})
		try {
			const { token } = await login(this.state.ticketId)

			const cookies = new Cookies();
			cookies.set('token', token, {
				path: '/',
				maxAge: 3600,
			});

			Router.push('/workshops')

		} catch(e) {
			this.setState({
				error: true,
				loading: false
			})
		}

		return false
	}

	onChange (e) {
		this.setState({
			ticketId: e.target.value
		})
	}

	showHelp (e) {
		e.stopPropagation();
		e.preventDefault();

		this.setState({
			modalOpen: true
		})
	}

	onModalClose () {
		this.setState({
			modalOpen: false
		})
	}

	render() {
		const { classes } = this.props;
		return <div className={classes.root}>

		<div className={classes.paper}>
			<Typography className={classes.title} variant="h2">
				JSConf Budapest 2019<br />
				Workshop Registration
			</Typography>

			<Paper className={classes.area} elevation={1}>
				<Typography component="p" className={classes.text}>
					Log in using your JSConf Budapest 2019 ticket ID.
				</Typography>

				<Typography component="p" className={classes.text}>
					<a href="https://ti.to/jsconf-bp/jsconf-budapest-2019">I don't have a ticket</a>
					<a href="" className={classes.ticketIdLink} onClick={e => this.showHelp(e)}>Where is my ticket ID?</a>
				</Typography>

				<form onSubmit={e => this.onSubmit(e) }>
					<div>
						<TextField
							error={ this.state.error }
							onChange={e => this.onChange(e)}
							label="Ticket ID"
							className={classes.textField}
							margin="normal"
							variant="outlined"
							placeholder="AAAA-1"
						/>
					</div>

					{ this.state.error ? (<div>
						<Button color="primary" variant="outlined" className={classes.retry} onClick={e => this.onSubmit(e) }>
							Retry
						</Button>
						<Typography component="p" className={classes.text}>
							Sorry, but it seems we can't find your ticket. <br />
							You can get one quickly by hitting the button below.
						</Typography>
						<Button variant="contained" color="primary" className={classes.button} href="https://ti.to/jsconf-bp/jsconf-budapest-2019">
							Buy your ticket from €311
						</Button>
						<Typography component="p" className={classes.mistake}>
							If you think this is a mistake, <a href="mailto:team@jsconfbp.com?subject=Workshop HELP, my ticket ID is not working!">please contact us</a>,{' '}
							so we can sort it out as soon as possible!
						</Typography>
					</div>) : (<div>
						{ this.state.loading ? (<>
							<CircularProgress className={classes.progress} />
							</>) :
						(<Button variant="contained" color="secondary" className={classes.button} onClick={e => this.onSubmit(e) }>
							Login
						</Button>)}
					</div>)}

				</form>
      		</Paper>
		</div>

		<Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modalOpen}
          onClose={e => this.onModalClose()}
        >
			<Card className={classes.card}>
				<CardActionArea>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							Find your ticket ID
						</Typography>
						<Typography component="p" className={classes.helpText}>
							Your ticket ID is an alphanumeric ID, four letters and a number,
							for example: <strong>AAAA-1</strong>
						</Typography>
						<Typography component="p">
							It is located at the top of your received ticket, like this:
						</Typography>
					</CardContent>
					<CardMedia
						className={classes.media}
						image="/static/ticket_example.png"
						title="Example Ticket"
					/>
				</CardActionArea>
				<CardActions>
					<Button size="small" color="secondary" onClick={ e => this.onModalClose() }>
						Got it, thanks
					</Button>
					<Button size="small" color="secondary">
						<a href="mailto:team@jsconfbp.com?subject=Workshop HELP, I can't find my ticket id!">Help!</a>
					</Button>
				</CardActions>
			</Card>
        </Modal>

	</div>
	}


	static getInitialProps({ req, store, auth }) {
		return {}
	}

}


export default withStyles(styles)(Index)