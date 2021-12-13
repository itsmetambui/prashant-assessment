import type { NextPage } from "next";
import React from "react";
import makeData from "../app/makeData";
import Table from "../components/Table";

const IndexPage: NextPage = () => {
  const serverData = React.useMemo(() => makeData(200), []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Avatar",
        accessor: "avatarURL",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Lectures Attended",
        accessor: "lecturesAttended",
      },
      {
        Header: "Total Lectures",
        accessor: "totalLectures",
      },
    ],
    []
  );

  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current;

    // Set the loading state
    setLoading(true);

    // We'll even set a delay to simulate a server here
    setTimeout(() => {
      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        setData(serverData.slice(startRow, endRow));

        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(serverData.length / pageSize));

        setLoading(false);
      }
    }, 1000);
  }, []);

  return (
    <Table
      columns={columns}
      data={data}
      fetchData={fetchData}
      loading={loading}
      pageCount={pageCount}
    />
  );
};

export default IndexPage;
