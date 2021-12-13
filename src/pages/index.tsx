import type { NextPage } from "next";
import React from "react";
import { useInfiniteQuery } from "react-query";

import makeData from "../app/makeData";
import Table from "../components/Table";

const IndexPage: NextPage = () => {
  const serverData = React.useMemo(() => makeData(1000), []);

  const [{ name }, setFilterParams] = React.useState({
    name: "",
  });

  const fetchStudents = async (pg: number, name: string, limit: number) => {
    const offset = (pg - 1) * limit;
    // const res = await axios.get(
    //   `/posts?folder=${id}&offset=${offset}&limit=${limit}`
    // );
    // return res.data;
    console.log(offset, limit);
    return serverData.slice(offset, offset + limit);
  };

  const {
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    status,
    data = { pages: [] },
  } = useInfiniteQuery(
    ["students", { name }],
    ({ pageParam = 1 }) => fetchStudents(pageParam, name, 20),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        return allGroups.length + 1 || null;
      },
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Avatar",
        accessor: "avatarURL",
        width: 400,
      },
      {
        Header: "Name",
        accessor: "name",
        width: 300,
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

  const row = data.pages.reduce((acc, cur) => [...acc, ...cur], []) || [];

  return (
    <div>
      <Table
        columns={columns}
        data={row}
        update={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};

export default IndexPage;
