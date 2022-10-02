import {
  Stepper,
  Step,
  StepLabel,
  styled,
} from '@mui/material';
import { red, green } from '@mui/material/colors';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import './Steps.scss';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: red[400],
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-completedIconCorrect': {
    color: green[400],
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        chooseIcon(props)
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

function chooseIcon({ correct, icon }) {
  if (correct && correct === icon) {
    return <CheckIcon className="QontoStepIcon-completedIconCorrect" />
  }
  else {
    return <CloseIcon className="QontoStepIcon-completedIcon" />
  }
}

function Steps(props) {
  return (
    <Stepper alternativeLabel activeStep={props.active} connector={<QontoConnector />} className="Steps">
      {props.steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={QontoStepIcon} StepIconProps={{ correct: props.correct }} />
        </Step>
      ))}
    </Stepper>
  );

}

export default Steps