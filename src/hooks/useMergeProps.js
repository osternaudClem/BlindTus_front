import { useMemo } from 'react';

const useMergeProps = ({
  ownProps = {},
  selectedProps = {},
  actionsProps = {},
  otherProps = {},
}: PropsToBeGrouped) =>
  useMemo(
    () => ({
      ...ownProps,
      ...selectedProps,
      ...actionsProps,
      ...otherProps,
    }),
    [actionsProps, ownProps, selectedProps, otherProps]
  );

export default useMergeProps;
