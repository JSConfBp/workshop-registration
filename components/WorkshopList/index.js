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
	},
	workshopTitle: {
		marginTop: '1rem',
		marginBottom: '1rem',
		paddingRight: '4rem',
	},
	workshopDescription: {
	},
	item: {
		paddingRight: '6rem',
		borderBottom: '1px solid #ddd',
		paddingBottom: '2rem',
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
	}

});

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
								</>
							}
						/>
						<ListItemSecondaryAction className={classes.seats}>
							{ seats[workshopId] ? (<Seats {...seats[workshopId]} />) : ('') }
						</ListItemSecondaryAction>
					</ListItem>)
				})
			}
		</List>

		</div>);
	}
}

export default withStyles(classes)(WorkshopList)