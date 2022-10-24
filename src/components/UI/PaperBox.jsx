import PropTypes from 'prop-types';
import { Paper } from '@mui/material';

const PaperBox = ({ children, className, style, ...props }) => (
  <Paper
    elevation={2}
    style={{ padding: '1rem', ...style }}
    className={className}
    {...props}
  >
    {children}
  </Paper>
);

PaperBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

PaperBox.defaultProps = {
  children: undefined,
  className: null,
  style: {},
};

export default PaperBox;
