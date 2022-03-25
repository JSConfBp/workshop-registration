import React from 'react'
import fetch from 'isomorphic-unfetch'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Router from 'next/router'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

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
		[theme.breakpoints.down('sm')]: {
			width: '100vw',
			marginTop: theme.spacing.unit * 3,
			marginBottom: theme.spacing.unit * 3,
		}
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
		textAlign: 'left',
		margin: '0 auto',
		marginTop: '4rem',
		padding: '2rem',
		[theme.breakpoints.down('sm')]: {
			padding: '1rem',
			marginTop: '2rem',
		}
	},
	text: {
		marginBottom: '1rem',
	},
	media: {
		height: 110,
	},
	resetArea: {
		paddingTop: theme.spacing.unit * 8,
		textAlign: 'center',
		[theme.breakpoints.down('sm')]: {
			paddingTop: theme.spacing.unit * 4,
		}
	},
	ticketId: {
		whiteSpace: 'nowrap'
	},
	divider: {
		[theme.breakpoints.down('sm')]: {
			margin: 0
		}
	}
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
			).then(async response => {
				if (response.status === 409){
					throw new Error(await response.text())
				}

				if (response.status !== 200) throw new Error(warningMessage)
			})
			this.setState({
				saved: true,
				saveState: 'success',
				selectedWorkshop: workshop
			})
		} catch(e) {
			this.setState({
				saved: true,
				saveState: 'warning',
				saveMessage: e.message || warningMessage
			})
		}
		this.fetchSeats()
	}

	async onUnregister () {
		this.setState({
			selectedWorkshop: ''
		})

		try {
			await fetch(
				'/api/user',
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					}
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
						JSConf Budapest 2022<br />
						Workshop Registration
					</Typography>

					<Paper className={classes.area} elevation={1}>
						<Typography variant="h5" className={classes.text}>
							Great to see you <span className={classes.ticketId}>
							{user.ticketId}!</span>
						</Typography>

						<Typography component="p" className={classes.text}>


							{/* Registration for the 2019 workshops are closed, sorry! */}

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

						<Divider className={classes.divider} variant="middle" />

						<div className={classes.resetArea}>
							<Button
								variant="outlined"
								className={classes.button}
								onClick={ e => this.onUnregister() }
							>
								Reset your selection, unregister from workshops
							</Button>
						</div>
					</Paper>
				</div>
			</div>

			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={this.state.saved}
				autoHideDuration={1500}
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
