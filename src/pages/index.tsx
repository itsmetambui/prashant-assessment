import type { NextPage } from "next";
import React from "react";
import { useTable } from "react-table";
import Table from "../components/Table";

const IndexPage: NextPage = () => {
  const data = React.useMemo(
    () => [
      {
        name: "Test 1",
        avatarURL: "Test 1",
        lecturesAttended: 10,
        totalLectures: 30,
        marks: {
          mth101: {
            subjectTitle: "Introduction to mathematics",
            totalMarks: 100,
            markesObtained: 56,
          },
          eng112: {
            subjectTitle: "English diagnostics",
            totalMarks: 100,
            markesObtained: 76,
          },
        },
      },
      {
        name: "Test 2",
        avatarURL: "Test 2",
        lecturesAttended: 5,
        totalLectures: 25,
        marks: {
          mth101: {
            subjectTitle: "Introduction to mathematics",
            totalMarks: 100,
            markesObtained: 77,
          },
          eng112: {
            subjectTitle: "English diagnostics",
            totalMarks: 100,
            markesObtained: 51,
          },
        },
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Avatar",
        accessor: "avatarURL",
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
