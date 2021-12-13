import type { NextPage } from "next";
import React from "react";
import makeData from "../app/makeData";
import Table from "../components/Table";

const IndexPage: NextPage = () => {
  const data = React.useMemo(() => makeData(100), []);

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

  return <Table data={data} columns={columns} />;
};

export default IndexPage;
