import React from "react";

function NotificationDataTable({
  headData = [],
  data = [],
  caption,
  limit,
  setLimit = () => {},
  page,
  setPage = () => {},
  pagination,
  isLoading = false,
  tableProps = {},
  count = 0,
  ...props
}) {
  return <div>NotificationDataTable</div>;
}

export default NotificationDataTable;
