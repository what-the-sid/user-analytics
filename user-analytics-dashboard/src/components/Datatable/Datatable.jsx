import React from "react";
import DataTable from "react-data-table-component";
import { Button } from "../Button/Button";

export const Datatable = ({ setShowModal, analytics, setModalDataId }) => {
  const columns = [
    {
      name: "User Id",
      selector: (row) => row.userId,
      sortable: true,
    },
    {
      name: "Timestamp",
      selector: (row) => row.time,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Payload",
      selector: (row) => row.payload,
      sortable: true,
    },
  ];
  const data = analytics.map((e,i)=>{
    return {
      id:i+1,
      userId: e.userId,
      time: new Date(e.timeStamp).toISOString(),
      status: e.status,
      payload: (
            <div onClick={() => {
              setShowModal(true)
              setModalDataId(e.requestId)
            }}>
              <Button text="View" />
            </div>
          )
    }
  })
  return <DataTable columns={columns} data={data} pagination responsive />;
};
