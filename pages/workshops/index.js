import React from 'react'
import fetch from 'isomorphic-unfetch'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Router from 'next/router'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'

import Notification from '../../components/Notification'
import WorkshopList from '../../components/WorkshopList'

const successMessage = 'Your selection was saved';
const warningMessage = 'Sorry, there was an error saving your selection. Try again later, or contact us';

const classes = theme => ({
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
	}),
	title: {
		marginBottom: theme.spacing.unit * 3,
		lineHeight: '5rem',
	},
	area: {
		textAlign: 'left',
		margin: '0 auto',
		marginTop: '4rem',
		//maxWidth: '42rem',
		padding: '2rem',
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
	},
	helpText: {
		marginBottom: '1rem',
	},
	media: {
		height: 110,
	},
});


class Workshops extends React.Component {

	state = {
		selectedWorkshop: '',
		seats: {},
		saved: false,
		saveState: 'success',
		saveMessage: successMessage
	}

	constructor (props) {
		super(props)

		this.state.selectedWorkshop = props.user.workshop
	}

	closeNotification() {
		this.setState({ saved: false })
	}

	async componentDidMount() {
		this.fetchSeats()
	}

	componentWillUnmount() {
		this.abortSignal.abort()
	}

	async fetchSeats () {
		this.abortSignal = new AbortController();
		try {
			const seats = await fetch('/api/seats', {
				method: 'GET',
				signal: this.abortSignal.signal,
			}).then(response => response.json())
			this.setState({
				seats
			})
		} catch (e) {
			console.error('Failed to fetch seats', e)
		}
	}

	async onWorkshopSelect (workshop) {
		this.setState({
			selectedWorkshop: workshop
		})

		try {
			await fetch(
				'/api/user',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						workshop
					})
				}
			).then(response => {
				if (response.status !== 200) throw new Error(warningMessage)
			})
			this.setState({
				saved: true,
				saveState: 'success',
			})
			this.fetchSeats()
		} catch(e) {
			this.setState({
				saved: true,
				saveState: 'warning',
				saveMessage: e.message || warningMessage
			})
		}
	}

	render() {
		const { classes, user } = this.props;
		const { seats, selectedWorkshop } = this.state

		return (<>
			<div className={classes.root}>
				<div className={classes.paper}>
					<Typography className={classes.title} variant="h2">
						JSConf Budapest 2019<br />
						Workshop Registration
					</Typography>

					<Paper className={classes.area} elevation={1}>
						<Typography variant="h5" className={classes.text}>
							Great to see you {user.ticketId}!
						</Typography>

						<Typography component="p" className={classes.text}>
							Here are the current list of workshops available. You can pick one, or update your preferred
							workshop and choose another one, if there are enough seats. Workshops marked with "NEW" were added to the
							conference since your last visit here.
						</Typography>

						<WorkshopList
							user={ user }
							workshop={ selectedWorkshop }
							seats={ seats }
							onSelect={ ws => this.onWorkshopSelect(ws) }
							lastVisitedAt={user.updatedAt}
						/>
					</Paper>
				</div>
			</div>

			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={this.state.saved}
				autoHideDuration={3000}
				onClose={e => this.closeNotification()}
			>
				<Notification
					onClose={e => this.closeNotification()}
					variant={this.state.saveState}
					message={this.state.saveMessage}
				/>
			</Snackbar>
		</>)
	}

	static async getInitialProps({ req, res, store, auth }) {

		if (process.browser) {
			try {
				const user = await fetch('/api/user')
					.then(response => {
						if (response.status !== 200) {
							throw new Error('Unauthorized')
						}
						return response
					})
					.then(response => response.json())

				return {
					user
				}
			} catch (e) {
				console.error(e);
				Router.push('/home', '/')
			}
		} else {
			try {
				const { cookies: { token }} = req
				const user = await fetch(
						`http://0.0.0.0:${process.env.PORT}/api/user`,
						{
							headers: {
								'Authorization': `Bearer ${token}`
							}
						}
					)
					.then(response => {
						if (response.status !== 200) {
							throw new Error('Unauthorized')
						}
						return response
					})
					.then(response => response.json())

				return {
					user
				}
			} catch (e) {
				res.redirect('/');
			}
		}
	}
}

export default withStyles(classes)(Workshops)