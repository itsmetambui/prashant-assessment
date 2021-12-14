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
import { useAppDispatch, useAppSelector } from "../app/store";
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
  width:30rem;
  height: 25rem;
  padding: 2rem;
  background-color: white;
  transition : all 0.3s ease-in-out;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ModalHead = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const ModalBody = styled.div`
  padding: 0 1rem 0 3rem;
  flex: 1;
`;

const Mark = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const SubjectTitle = styled.p`
  font-size: 12px;
  color: gray;
`;

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
        <ModalHead>
          <Image
            src={selectedStudent.value?.avatarURL}
            height={200}
            width={200}
            priority
          />
          <div>
            <p>
              <strong>Name:</strong> {selectedStudent.value?.name}
            </p>
            <p>
              <strong>Lectures Attended:</strong>{" "}
              {selectedStudent.value?.lecturesAttended}
            </p>
            <p>
              <strong>Total Lectures:</strong>{" "}
              {selectedStudent.value?.totalLectures}
            </p>
          </div>
        </ModalHead>
        <ModalBody>
          {Object.keys(selectedStudent.value?.marks || {}).map((code) => {
            const mark = selectedStudent.value?.marks[code];

            return (
              <Mark key={`${selectedStudent.value?.name}-${code}`}>
                <div>
                  <p>{code}</p>
                  <SubjectTitle>{mark.subjectTitle}</SubjectTitle>
                </div>

                <p>
                  {mark.markesObtained}/{mark.totalMarks}
                </p>
              </Mark>
            );
          })}
        </ModalBody>
      </StyledModal>
    </Container>
  );
};

export default IndexPage;
