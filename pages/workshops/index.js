import React from 'react'
import fetch from 'isomorphic-unfetch'
import classNames from 'classnames'
import getConfig from 'next/config'


import { KJUR } from 'jsrsasign'

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
		maxWidth: '42rem',
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

	constructor (props) {
		super(props)

		this.state = {

		}
	}

	async updateCfp(cfp) {
		const stats = await getStats(this.props.auth.token)
		const state = Object.assign({}, {
			stats,
			cfp
		})
		this.setState(state)
	}

	render() {

		const { classes, user } = this.props;
		return (<div className={classes.root}>

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
						workshop and choose another one, if there are enough seats. We'll mark you the workshops that
						joined our conference since your last visit.
					</Typography>

				</Paper>
			</div>
		</div>)
	}

	static async getInitialProps({ req, res, store, auth }) {

		if (process.browser) {
			try {
				const user = await fetch('/api/user')
					.then(response => {
						if (response.status !== 200) {
							throw new Error('Unauthorized')
						}
						return resposne
					})
					.then(response => response.json())

				return {
					user
				}
			} catch (e) {
				Router.push('/')
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