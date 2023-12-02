import axios from "axios";
import { React, useContext, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormSelect from "react-bootstrap/FormSelect";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { BsPassFill } from "react-icons/bs";
import { useState } from "react";
import Papa from "papaparse"

import ResultModal from "./ResultModal.js";

import { TestContext } from "../../contexts/TestContext";

function ContentDashboard(props) {
  // const [typeCashOut, setTypeCashOut] = useState(true);
  // const [typeTransfer, setTypeTransfer] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  // const [modalData, setModalData] = useState("default");
  // const [datajson, setDataJson] = useState({});

  const queriesUpdate = props.queriesUpdate;
  const setQueriesUpdate = props.setQueriesUpdate;
  const [errMessage, setErrMessage] = useState("");
  const [file,setFile]=useState()

  var datajson = useRef({});

  var resultData = useRef("default");

  var modalData = useRef("default");

  var typeCashOut = useRef(true);
  var typeTransfer = useRef(false);

  var oldBalanceOrig = useRef(null);
  var newBalanceOrig = useRef(null);
  var oldBalanceDest = useRef(null);
  var newBalanceDest = useRef(null);
  var transactionAmount = useRef(null);
  var TransactionTime = useRef(1);

  const resetFields = () => {
    // datajson.current = {};
    console.log("Fields reset");

    // resultData.current = "default";

    // modalData.current = "default";

    typeCashOut.current = true;
    typeTransfer.current = false;

    oldBalanceOrig.current = null;
    newBalanceOrig.current = null;
    oldBalanceDest.current = null;
    newBalanceDest.current = null;
    transactionAmount.current = null;
    TransactionTime.current = 1;
    console.log("reset, amount > ", transactionAmount.current);
  };
  // resetFields();

  // var datajson = {};

  const { user, setUser } = useContext(TestContext);

  const clearForm = () => {
    var formData = document.getElementById("mainForm");
    formData.reset();
  };
  const validateForm = () => {
    var isValid = true;
    if (
      oldBalanceOrig.current === null ||
      newBalanceOrig.current === null ||
      oldBalanceDest.current === null ||
      newBalanceDest.current === null ||
      transactionAmount.current === null
    ) {
      setErrMessage("All form fields are mandatory");
      isValid = false;
    } else if (
      isNaN(oldBalanceOrig.current) ||
      isNaN(newBalanceOrig.current) ||
      isNaN(oldBalanceDest.current) ||
      isNaN(newBalanceDest.current) ||
      isNaN(transactionAmount.current)
    ) {
      setErrMessage("All values must be numbers");
      isValid = false;
    }
    // if (oldBalanceOrig.current != null) {
    // console.log("oldBalOrg:", newBalanceOrig)}
    // }
    return isValid;
  };

  const handleChange = async (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    
    // console.log("transaction amount > ", transactionAmount);
    e.preventDefault();
    const reader = new FileReader();

    Papa.parse(document.getElementById("csv").files[0], {
      header:true,
      complete: function(results) {
          console.log("Finished:", results.meta.fields);
      }
    });
    
    // if (validateForm()) {
    //   console.log("here2VALID");
    //   // console.log("on submit entry amount value > ", transactionAmount.current);
    //   setErrMessage("");
    //   e.preventDefault();
      // datajson.current = {
      //   user_id: user._id,
      //   amount: transactionAmount.current,
      //   oldbalanceOrg: oldBalanceOrig.current,
      //   newbalanceOrg: newBalanceOrig.current,
      //   origBalance_inacc:
      //     oldBalanceOrig.current -
      //     transactionAmount.current -
      //     newBalanceOrig.current,
      //   oldbalanceDest: oldBalanceDest.current,
      //   newbalanceDest: newBalanceDest.current,
      //   destBalance_inacc:
      //     oldBalanceDest.current +
      //     transactionAmount.current -
      //     newBalanceDest.current,
      //   type_CASH_OUT: typeCashOut.current,
      //   type_TRANSFER: typeTransfer.current,
      //   step: TransactionTime.current,
      // };

      // setDataJson({
      //   user_id: user._id,
      //   amount: transactionAmount,
      //   oldbalanceOrg: oldBalanceOrig,
      //   newbalanceOrg: newBalanceOrig,
      //   origBalance_inacc: oldBalanceOrig - transactionAmount - newBalanceOrig,
      //   oldbalanceDest: oldBalanceDest,
      //   newbalanceDest: newBalanceDest,
      //   destBalance_inacc: oldBalanceDest + transactionAmount - newBalanceDest,
      //   type_CASH_OUT: typeCashOut,
      //   type_TRANSFER: typeTransfer,
      //   step: TransactionTime,
      //   alias: transactionAlias,
      // });
      // const ml_datajson_array = [
      //   TransactionTime.current,
      //   transactionAmount.current,
      //   oldBalanceOrig.current,
      //   oldBalanceDest.current,
      //   oldBalanceOrig.current -
      //     transactionAmount.current -
      //     newBalanceOrig.current,
      //   oldBalanceDest.current +
      //     transactionAmount.current -
      //     newBalanceDest.current,
      //   typeCashOut.current,
      //   typeTransfer.current,
      // ];

      // console.log("datajson collection, ", datajson);
      // console.log("ml query data collection, ", ml_datajson_array); // console.log(datajson);
    //   const POST_ml_query = async (record) => {
    //     const data = [record];
    //     console.log("ml query data in POST", data);
    //     const res = await fetch("http://127.0.0.1:5000/ml_query", {
    //       method: "POST",
    //       body: JSON.stringify({ data: data }),
    //       headers: { "Content-Type": "application/json" },
    //       credentials: "include",
    //     })
    //       .then((res) => res.json())
    //       .then((res) => {
    //         modalData.current = res[0];
    //         // console.log("modalData ,", res[0]);
    //         setShowResultModal(true);
    //       });
    //   };

    //   POST_ml_query(ml_datajson_array);

    //   resetFields();
    //   setQueriesUpdate(!queriesUpdate);

    //   clearForm();
    // }
  };

  // (e) =>{(e)=>{if(e.currentTarget.value= 'transfer'){setTypeCashOut(0);setTypeTransfer(1)}}}
  const handleTransactionType = (e) => {
    if (e.currentTarget.value == "transfer") {
      typeTransfer.current = true;
      typeCashOut.current = false;
    } else {
      typeCashOut.current = true;
      typeTransfer.current = false;
    }
  };
  const handleTransactionTime = (e) => {
    TransactionTime.current = parseInt(e.currentTarget.value);
    // console.log(TransactionTime);
  };
  return (
    <div className="flex justify-center container p-4 self-center">
      <div className="w-1/2 h-full ">
        {/* {showResultModal && (
          <ResultModal
            queriesUpdate={queriesUpdate}
            setQueriesUpdate={setQueriesUpdate}
            queryData={datajson}
            result={modalData}
            show={showResultModal}
            onHide={() => setShowResultModal(false)}
            showResultState={{ showResultModal, setShowResultModal }}
          />
        )} */}

              <Form.Label className="mb-4">Upload Customer Dataset</Form.Label>
              <input type ={"file"} id={"csv"} accept={".csv"} onChange={handleChange}></input>

          {/* <Form.Group className="mb-3" controlId="formTransactionAlias">
            <Form.Label>Enter Alias</Form.Label>
            <Form.Control
              placeholder="Enter an alias for this query (ex: JHN-09-02-03)"
              autoComplete="off"
              onChange={(e) => {
                transactionAlias = e.target.value;
              }}
            />
          </Form.Group> */}
          {/* <div className='flex justify-center container bg-orange-200'>
                        <Row className="mb-3 flex flex-col">
                            <div className='flex'>
                                <Form.Group as={Col} controlId="formTimeofTransaction">
                                    <Form.Label>Select the Time of Transaction</Form.Label>
                                    <Form.Select defaultValue="Choose...">
                                        <option>00:00 - 01:00</option>
                                        <option>01:00 - 02:00</option>
                                        <option>02:00 - 03:00</option>
                                        <option>03:00 - 04:00</option>
                                        <option>04:00 - 05:00</option>
                                        <option>05:00 - 06:00</option>
                                        <option>06:00 - 07:00</option>
                                        <option>07:00 - 08:00</option>
                                        <option>08:00 - 09:00</option>
                                        <option>09:00 - 10:00</option>
                                        <option>10:00 - 11:00</option>
                                        <option>11:00 - 12:00</option>
                                   </Form.Select>
                                </Form.Group>
                            </div>
                            <div className='flex bg-slate-50'>
                                <Form.Group as={Col} controlId="formTimeofTransaction">
                                    <div className='flex-1'>
                                    <span>AM</span>
                                    </div>
                                    <Form.Check type="switch" id="custom-switch" label="PM" />
                                </Form.Group>
                            </div>
                        </Row>
                    </div> */}

          {/* <div className="text-red-500 mb-3">{errMessage}</div> */}
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
      </div>
    </div>
  );
}

export default ContentDashboard;
