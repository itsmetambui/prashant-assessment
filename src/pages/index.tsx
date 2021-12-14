import type { NextPage } from "next";
import React from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import styled from "styled-components";
import Image from "next/image";

import Table from "../components/Table";
import useDebounce from "../hooks/useDebounce";

const Container = styled.div`
  padding: 1rem;
`;

const Input = styled.input`
  padding: 8px 12px;
  margin-bottom: 1rem;
  width: 300px;
`;

const IndexPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchStudents = async (
    pg: number,
    searchTerm: string,
    limit: number
  ) => {
    const offset = (pg - 1) * limit;
    const res = await axios.get(
      `/students?searchTerm=${searchTerm}&skip=${offset}&limit=${limit}`
    );
    return res.data;
  };

  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    data = { pages: [] },
  } = useInfiniteQuery(
    ["students", { searchTerm: debouncedSearchTerm }],
    ({ pageParam = 1 }) => fetchStudents(pageParam, debouncedSearchTerm, 20),
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
        Cell: ({ cell: { value } }) => (
          <Image src={value} width={60} height={60} priority />
        ),
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

  const row =
    data.pages.reduce((acc, cur) => [...acc, ...cur.students], []) || [];

  return (
    <Container>
      <Input
        placeholder="Search"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table
        columns={columns}
        data={row}
        update={fetchNextPage}
        hasNextPage={hasNextPage}
      />
      {isFetching && <p>Loading...</p>}
    </Container>
  );
};

export default IndexPage;
