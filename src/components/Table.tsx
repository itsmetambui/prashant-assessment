import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTable, useBlockLayout } from "react-table";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import styled from "styled-components";

const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 1px solid black;
      }
    }
  }
`;

export default function Table({ columns, data, update, hasNextPage }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable(
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
            loadMoreItems={update}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                height={400}
                itemCount={rows.length}
                itemSize={35}
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
