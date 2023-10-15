import React, { useEffect, useState } from 'react';
import styles from "./Modal.module.css";
import { CopyBlock, dracula } from "react-code-blocks";

export const Modal = ({ code, language, showLineNumbers, setShowModal, logId }) => {

  const [logs, setLogs] = useState(null)

  useEffect(()=>{
    (async ()=>{
      const queryString = new URLSearchParams({
        key: logId+".json"
      }).toString();
      const url = "https://87tewrn0r1.execute-api.ap-south-1.amazonaws.com/staging/get-logs?" + queryString
      await fetch(url).then(async (res)=>{
        res = await res.json()
        setLogs(res)
      })
    })()
  },[logId])

  useEffect(() => {
  window.scrollTo(0, 0)
}, [])

  return (
    <div className={styles.modal}>
      <div>
      <button
        className={styles.closeButton}
        onClick={() => setShowModal(false)}
      >
        <svg
          className={styles.closeIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      </div>
      {
        logs && (
          <div>
          <div className={styles.codeContainer}>
            <h4> Request Body</h4>
            <CopyBlock
              text={JSON.stringify(logs.requestBody)}
              language={"json"}
              showLineNumbers={true}
              theme={dracula}
              codeBlock
            />
          </div>

          <div className={styles.codeContainer}>
          <h4> Response</h4>
            <CopyBlock
              text={JSON.stringify(logs.response)}
              language={"json"}
              showLineNumbers={true}
              theme={dracula}
              codeBlock
            />
          </div>

          <div className={styles.codeContainer}>
          <h4> Request Headers</h4>
            <CopyBlock
              text={JSON.stringify(logs.requestHeaders)}
              language={"json"}
              showLineNumbers={true}
              theme={dracula}
              codeBlock
            />
          </div>
          </div>
        )
      }
    </div>
  );
};
