import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

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
		color: '#555',
		width: '3rem',
	  height: '3rem',
	}
  });


class CircularStatic extends React.Component {
	state = {
	  completed: 0,
	};

	render() {
	  const { classes, value = 0 } = this.props;
	  return (
		<div className={classes.seats}>
				<CircularProgress className={classes.value} variant="static" value={ value } size={'3rem'} />
		  	<CircularProgress className={classes.bg} variant="static" value={100} size={'3rem'} />
		</div>
	  );
	}
  }
  
  CircularStatic.propTypes = {
	classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(CircularStatic);