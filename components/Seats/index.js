import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
	seats: {
	  width: '3rem',
	  height: '3rem',
	  position: 'relative',
	},
	bg: {
		position: 'absolute',
		zIndex: '1',
		color: '#ddd',
		width: '3rem',
	  height: '3rem',
	},
	value: {
		zIndex: '2',
		position: 'absolute',

		width: '3rem',
	  height: '3rem',
	}
  });


class Seats extends React.Component {
	state = {
	  completed: 0,
	};

	render() {
		const { classes, className, seats = 0, taken = 0 } = this.props;

		let value = 0

		if (seats > 0) {
			value = Math.round((taken / seats) * 100)
		}

	  return (
			<Tooltip className={className} title={`Seats ${seats} / ${taken}`}>
				<div className={classes.seats}>
					<CircularProgress color={ classes.value > 75 ? 'primary' : 'secondary'} className={classes.value} variant="static" value={ value } size={'3rem'} />
		  		<CircularProgress className={classes.bg} variant="static" value={100} size={'3rem'} />
				</div>
      </Tooltip>);
	}
}

Seats.propTypes = {
	classes: PropTypes.object.isRequired,
	seats: PropTypes.number,
	taken: PropTypes.number,
};

  export default withStyles(styles)(Seats);