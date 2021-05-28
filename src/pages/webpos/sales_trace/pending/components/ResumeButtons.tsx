import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import RedoIcon from '@material-ui/icons/Redo';
import { InvoiceParams } from '../data';

interface ActionButtonsProps {
  record?: InvoiceParams;
  handleResumeOrder?: (record: InvoiceParams) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(0.5),
    },
  }),
);

const ResumeButtons: React.FC<ActionButtonsProps> = ({ record = null, handleResumeOrder }) => {
  const classes = useStyles();

  return (
    <div>
      <Tooltip title="Resume" aria-label="Resume">
        <Fab
          size="small"
          color="primary"
          className={classes.margin}
          onClick={(e) => {
            e.stopPropagation();
            handleResumeOrder(record)}}
        >
          <RedoIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default ResumeButtons;
