import type { NextPage } from "next";
import Head from "next/head";

import Counter from "../features/counter/Counter";

import styled from "styled-components";

const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

const IndexPage: NextPage = () => {
  return <Title>Assessment</Title>;
};

export default IndexPage;
