import PropTypes from 'prop-types';
import { Paper } from '@mui/material';

const PaperBox = ({ children, className }) => (
  <Paper
    elevation={2}
    style={{ padding: '1rem' }}
    className={className}
  >
    {children}
  </Paper>
);

PaperBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

PaperBox.defaultProps = {
  children: undefined,
  className: null,
};

export default PaperBox;
