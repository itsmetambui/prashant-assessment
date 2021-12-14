import type { NextPage } from "next";
import React from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import styled from "styled-components";
import Image from "next/image";
import Modal from "styled-react-modal";

import Table from "../components/Table";
import useDebounce from "../hooks/useDebounce";
import { Column } from "react-table";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  select,
  selectCurrentStudent,
} from "../features/counter/selectedStudentSlice";

const Container = styled.div`
  padding: 1rem;
`;

const Input = styled.input`
  padding: 8px 12px;
  margin-bottom: 1rem;
  width: 300px;
  border: 1px solid black;
`;

const StyledModal = Modal.styled`
  width: 20rem;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  transition : all 0.3s ease-in-out;`;

const IndexPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const selectedStudent = useAppSelector(selectCurrentStudent);
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleRowClick = (student: Student) => {
    dispatch(select(student));
    toggleModal();
  };

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

  const columns = React.useMemo<Column<Student>[]>(
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
        loadMoreItems={fetchNextPage}
        hasNextPage={hasNextPage}
        onRowClick={handleRowClick}
      />
      {isFetching && <p>Loading...</p>}

      <StyledModal
        isOpen={isOpen}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
      >
        <span>I am {selectedStudent.value?.name}</span>
        <button onClick={toggleModal}>Close me</button>
      </StyledModal>
    </Container>
  );
};

export default IndexPage;
