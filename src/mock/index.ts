import makeData from "../app/makeData";
import mock from "./adapter";

const totalRecords = 1000;
const data = makeData(totalRecords);

mock.onGet(new RegExp(`/students/*`)).reply(function (config) {
  const urlSearchParams = new URLSearchParams(config.url.split("?")[1]);
  const { searchTerm, limit, skip } = Object.fromEntries(
    urlSearchParams.entries()
  );
  console.log(searchTerm, limit, skip);

  return [
    200,
    {
      totalRecords,
      students: data
        .filter((student) => student.name.toLowerCase().includes(searchTerm))
        .slice(+skip, +skip + +limit),
    },
  ];
});
