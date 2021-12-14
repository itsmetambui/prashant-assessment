import React from "react";
import { useTable, useBlockLayout, Column } from "react-table";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import styled from "styled-components";

const Styles = styled.div`
  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: none;

      :last-child {
        border-right: 1px solid black;
      }
    }

    .td:hover {
      cursor: pointer;
    }
  }
`;

export default function Table({
  columns,
  data,
  loadMoreItems,
  hasNextPage,
  onRowClick,
}: {
  columns: Column<Student>[];
  data: Student[];
  loadMoreItems: () => void;
  hasNextPage: boolean;
  onRowClick?: (rowData: Student) => void;
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable<Student>(
    {
      columns,
      data,
    },
    useBlockLayout
  );

  const isItemLoaded = (index: number) => !hasNextPage || index < data.length;

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
          onClick={() => onRowClick(row.original)}
        >
          {!isItemLoaded(index) && <p>Loading...</p>}
          {isItemLoaded(index) &&
            row.cells.map((cell) => {
              return (
                <div {...cell.getCellProps()} className="td">
                  {cell.render("Cell")}
                </div>
              );
            })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  return (
    <Styles>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render("Header")}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={1000}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                height={600}
                itemCount={rows.length}
                itemSize={80}
                width={totalColumnsWidth + 16}
                ref={ref}
                onItemsRendered={onItemsRendered}
              >
                {RenderRow}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        </div>
      </div>
    </Styles>
  );
}
