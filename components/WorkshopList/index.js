import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Badge from '@material-ui/core/Badge';

import Seats from '../Seats'

import workshopData from '../../workshops'

const classes = theme => ({
	root: {
	  	...theme.mixins.gutters(),
	  	paddingTop: theme.spacing.unit * 2,
	  	paddingBottom: theme.spacing.unit * 2,
	  	[theme.breakpoints.down('sm')]: {
			paddingTop: theme.spacing.unit,
			paddingBottom: theme.spacing.unit,
			paddingLeft: 0,
			paddingRight: 0
		}
	},
	workshopTitle: {
		marginTop: '1rem',
		marginBottom: '1rem',
		paddingRight: '4rem',
		[theme.breakpoints.down('sm')]: {
			fontSize: '.9rem',
			paddingRight: '0rem',
			marginBottom: '.5rem',
		},
	},
	workshopDescription: {
		[theme.breakpoints.down('sm')]: {
			display: 'none'
		},
	},
	item: {
		paddingRight: '6rem',
		borderBottom: '1px solid #ddd',
		paddingBottom: '2rem',
		[theme.breakpoints.down('sm')]: {
			paddingRight: 0,
			paddingLeft: 0,
			paddingBottom: '1rem',
		},
	},
	itemText: {
		[theme.breakpoints.down('sm')]: {
			paddingRight: 0
		},
	},
	selected: {
		backgroundColor: '#f5f5f5'
	},
	lastItem: {
		borderBottom: 'none'
	},
	seats: {
		paddingRight: '1rem'
	},
	badge: {
		marginTop: '2rem',
		marginRight: '2rem',
		padding: '0 .7rem'
	},
	seats: {
		[theme.breakpoints.down('sm')]: {
			display: 'none'
		}
	},
	shortSeats: {
		display: 'none',
		fontSize: '.8rem',
		[theme.breakpoints.down('sm')]: {
			display: 'inline'
		}
	}
});


const ShortSeats = withStyles(classes)(({classes, seats = 0, taken = 0}) => {
	return (<span className={classes.shortSeats}>{`Seats ${seats} / ${taken}`}</span>)
})



class WorkshopList extends React.Component {

	onWorkshopSelect (workshop) {
		this.props.onSelect(workshop)
	}

	render() {
		const {
			classes,
			seats = {},
			lastVisitedAt,
			workshop: selectedWorkshop
		} = this.props

		const visited = new Date(lastVisitedAt * 1000)

		return (<div>
			<List className={classes.root}>
			{Object.entries(workshopData)
				.sort(([ workshopIdA, workshopA ], [ workshopIdB, workshopB ]) => {
					return (+new Date(workshopB.created)) - (+new Date(workshopA.created))
				})
				.map(([ workshopId, workshop ], index, allItems) => {

					const created = new Date(workshop.created)
					const title = (<Typography variant="h6" className={classes.workshopTitle}>
						{ workshop.title }
					</Typography>)

					const selectedItemClass = (selectedWorkshop === workshopId) ? classes.selected : '';
					const lastItemClass = (allItems.length - 1 === index) ? classes.lastItem : ''

					return (<ListItem
						key={`ws-${index}`}
						role={undefined}
						button
						className={classNames(classes.item, selectedItemClass, lastItemClass)}
						onClick={() => this.onWorkshopSelect(workshopId) }
					>
						<Radio
							color="primary"
							checked={selectedWorkshop === workshopId}
						/>
						<ListItemText
							className={ classes.itemText }
							primary={
								<>
									{ visited < created ? (<Badge color="secondary" badgeContent={'new'} classes={{ badge: classes.badge }}>
										{title}
									</Badge>) : (title)}
								</>
							}
							secondary={
								<>
									<Typography component="span" className={classes.workshopDescription}>
										{ workshop.short_description }
									</Typography>
									{ seats[workshopId] ? (<ShortSeats {...seats[workshopId]} />) : ('') }
								</>
							}
						/>
						<ListItemSecondaryAction className={classes.seats}>
							{ seats[workshopId] ? (<Seats {...seats[workshopId]} className={ classes.seats } />) : ('') }
						</ListItemSecondaryAction>
					</ListItem>)
				})
			}
		</List>

		</div>);
	}
}

export default withStyles(classes)(WorkshopList)