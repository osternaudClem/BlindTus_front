import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TextField, InputAdornment } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import './Forms.scss';

function MovieTextField({ onChange, placeholder, value, disabled, inputRef, isCorrect }) {
  return (
    <TextField
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      fullWidth
      autoFocus
      disabled={disabled}
      inputRef={inputRef}
      className={classnames({ 
        'Input--shaking': isCorrect === false,
      })}
      InputProps={{
        style: { height: '80px', fontSize: '24px' },
        endAdornment: renderIcon(),
      }}
    />
  )

  function renderIcon() {
    if (!isCorrect) {
      return <div />
    }

    return (
      <InputAdornment position="end">
        <CheckIcon color="success" sx={{ fontSize: 34 }} />
      </InputAdornment>
    );
  }
}

MovieTextField.propTypes = {
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  inputRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  isCorrect: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

MovieTextField.defaultProps = {
  onChange: () => { },
  disabled: false,
  inputRef: null,
  isCorrect: false,
  placeholder: 'Tape le nom du film',
  value: '',
};

export default MovieTextField;