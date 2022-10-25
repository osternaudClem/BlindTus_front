import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

function Heading({ children, type, ...props }) {
  let heading = {
    variant: 'h3',
    component: 'h2',
  };

  switch (type) {
    case 'subtitle':
      heading = {
        variant: 'h4',
        component: 'h3',
        spacing: 2,
      };
      break;
    default:
      heading = {
        variant: 'h3',
        component: 'h2',
        spacing: 4,
      };
  }

  return (
    <Typography
      variant={heading.variant}
      component={heading.component}
      marginBottom={heading.spacing}
      {...props}
    >
      {children}
    </Typography>
  );
}

Heading.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['title', 'subtitle']),
};

Heading.defaultProps = {
  children: null,
  type: 'title',
};

export default Heading;
