import "./App.css";
import { useState, useEffect } from "react";
import { Card } from "./components/Card/Card";
import { Chart } from "./components/Chart/Chart";
import { Container } from "./components/Container/Container";
import { Datatable } from "./components/Datatable/Datatable";
import { Modal } from "./components/Modal/Modal";
import { Filter } from "./components/Filter/Filter";
import ReactLoading from "react-loading";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalDataId, setModalDataId] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: new Date(),
      key: 'selection'
  }])
  const [analytics, setAnalytics] = useState(null)

  useEffect(()=>{
    (async ()=>{
      const {startDate, endDate} = dateRange[0]
      const queryString = new URLSearchParams({
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString()
      }).toString();
      const url = "https://87tewrn0r1.execute-api.ap-south-1.amazonaws.com/staging/get-analytics?" + queryString
      await fetch(url).then(async (res)=>{
        res = await res.json()
        setAnalytics(res)
      })
    })()
  },[dateRange])

  return (
    <div className="appContainer">
      <div className="section">
        <Container>
          <div className="filterContainer">
            <Filter range={dateRange} setDate={setDateRange}/>
          </div>
        </Container>
      </div>
      {
        analytics?(
          <div>
          <div className="cardSection section">
            <Container>
              <div className="cardContainer">
                <Card text="Total API Calls" number={analytics.successCount+analytics.failureCount} />
                <Card text="Failed API Calls" number={analytics.failureCount} />
                <Card text="Unique Users" number={analytics.uniqueUsers} />
              </div>
            </Container>
          </div>
          <div className="section">
            <Container>
              <h1 className="header">Data Chart</h1>
              <Chart data={analytics["data"]} dateRange={dateRange[0]} range={dateRange}/>
            </Container>
          </div>
          <div className="section">
            <Container>
              <h1 className="header">Data Table</h1>
              <Datatable setShowModal={setShowModal} analytics={analytics["data"]} setModalDataId = {setModalDataId}/>
            </Container>
          </div>
          {showModal && (
            <>
              <div className="overlay"></div>
              <Modal setShowModal={setShowModal} logId={modalDataId}/>
            </>
          )}
          </div>
          ):(
          <ReactLoading type="spin" color="#fff" />
        )
      }
      </div>
  );
}

export default App;
