import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { historyActions } from '../actions';
import {
  CssBaseline,
  Typography,
  Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  {
    field: 'code',
    headerName: 'CODE',
    minWidth: 150,
    flex: 1,
    renderCell: (params) => params.row.game.code,
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
    renderCell: (params) => params.value.musics.length,
  },
  {
    field: 'round_time',
    headerName: 'Temps',
    minWidth: 150,
    flex: 1,
    renderCell: (params) => `${params.row.game.round_time} secondes`,
  },
  {
    field: 'difficulty',
    headerName: 'Difficulté',
    minWidth: 150,
    flex: 1,
    renderCell: (params) => params.row.game.difficulty === 'easy' ? 'Facile' : 'Difficile',
  },
];


function History(props) {
  useEffect(() => {
    if (props.history.all.length === 0) {
    (async function() {
      await props.historyActions.getFullHistory();
    })();
    }
  }, [props.history.all, props.historyActions]);

  return (
    <div>
      <CssBaseline />
      <Typography variant="h2">Historique des parties</Typography>
      <Box sx={{ height: 735, width: '100%' }}>
          <DataGrid
            getRowId={(row) => row._id}
            rows={props.history.all}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
            disableSelectionOnClick
          />
        </Box>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    history: state.history,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    historyActions: bindActionCreators(historyActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(History)