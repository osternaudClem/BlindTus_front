import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { format } from 'date-fns';
import { CssBaseline, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Stack } from '@mui/system';
import { historyActions } from '../../actions';
import { updateTitle } from '../../lib/document';

const columns = [
  {
    field: 'code',
    headerName: 'CODE',
    minWidth: 150,
    flex: 1,
    valueGetter: (params) => params.row.game.code,
  },
  {
    field: 'total_score',
    headerName: 'Score',
    minWidth: 150,
    flex: 1,
  },
  {
    field: 'game',
    headerName: 'Nombre de musics',
    minWidth: 150,
    flex: 1,
    valueGetter: (params) => params.value.musics.length,
  },
  {
    field: 'round_time',
    headerName: 'Temps',
    minWidth: 150,
    flex: 1,
    valueGetter: (params) => `${params.row.game.round_time} secondes`,
  },
  {
    field: 'difficulty',
    headerName: 'Difficulté',
    minWidth: 150,
    flex: 1,
    valueGetter: (params) =>
      params.row.game.difficulty === 'easy' ? 'Facile' : 'Difficile',
  },
  {
    field: 'created_by',
    headerName: 'Créé par',
    minWidth: 150,
    flex: 1,
    valueGetter: (params) => params.row.game.created_by.username,
    renderCell: (params) => {
      const user = params.row.game.created_by;
      return (
        <Stack
          direction="row"
          alignItems="center"
        >
          <Avatar
            src={user.avatar}
            alt={user.username}
          />
          <Typography
            variant="subtitle1"
            marginLeft={2}
          >
            {user.username}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'created_at',
    headerName: 'Date de création',
    minWidth: 150,
    flex: 1,
    renderCell: (params) => {
      return format(new Date(params.value), "ii MMM yy @ kk'h'mm");
    },
  },
];

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <Box sx={{ mt: 1 }}>Historique vide !</Box>
    </StyledGridOverlay>
  );
}

function History(props) {
  useEffect(() => {
    updateTitle('Historique des parties');
  }, []);

  useEffect(() => {
    if (props.history.all.length === 0 && props.user._id) {
      (async function () {
        await props.historyActions.getFullHistory(props.user._id);
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <CssBaseline />
      <Typography
        component="h1"
        variant="h2"
        gutterBottom
      >
        Historique des parties
      </Typography>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          autoHeight
          getRowId={(row) => row._id}
          rows={props.history.all}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      </Box>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    history: state.history,
    user: state.users.me,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    historyActions: bindActionCreators(historyActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(History);
