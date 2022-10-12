import CheckIcon from '@mui/icons-material/Check';

import './Fullscreen.scss';

function AnswerType() {
  return (
    <div className="AnswerType">
      <div className="AnswerType__content">
        <CheckIcon sx={{ fontSize: 120 }} color="success" />
      </div>
    </div>
  )
}

export default AnswerType;