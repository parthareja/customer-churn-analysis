import axios from "axios";
import { React, useContext, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormSelect from "react-bootstrap/FormSelect";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from 'react-bootstrap/Spinner';
import { BsPassFill } from "react-icons/bs";
import { useState } from "react";
import Papa from "papaparse"
import { useNavigate } from "react-router-dom";

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
  const [file, setFile] = useState()
  const [spinnerIncremental, setSpinnerIncremental] = useState(false);
  const [spinnerTest, setSpinnerTest] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmitTesting = async (e) => {
    setSpinnerTest(true)
    e.preventDefault();
    const reader = new FileReader();
    var file = document.getElementById("excel").files[0]

    const formDataExcel = new FormData();

    // formDataExcel.append("layer_name", layer_name);
    formDataExcel.append("excel_file", file);
    console.log("uploading");
    await axios({
      method: "post",
      // url: "http://localhost:8080/dashboard/upload",
      url: "http://localhost:5000/upload_testing",
      data: formDataExcel,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formDataExcel._boundary}`,
      },
    }).then((res) => {
      console.log(res);
      setSpinnerTest(false)
      navigate("/inferenceDashboard")
    });
  };

  const handleSubmitIncremental = async (e) => {
    setSpinnerIncremental(true)
    e.preventDefault();
    const reader = new FileReader();
    var file = document.getElementById("excel").files[0]

    const formDataExcel = new FormData();

    // formDataExcel.append("layer_name", layer_name);
    formDataExcel.append("excel_file", file);
    console.log("uploading");
    await axios({
      method: "post",
      // url: "http://localhost:8080/dashboard/upload",
      url: "http://localhost:5000/upload_incremental",
      data: formDataExcel,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formDataExcel._boundary}`,
      },
    }).then((res) => {
      console.log(res);
      setSpinnerIncremental(false)
    });
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
  if (spinnerIncremental){
    return (
      <div className="flex justify-center container p-4 self-center">
        <div className="w-1/2 h-full ">
          <div>
            <h4 className="font-weight-bold"><b>Training your model...</b></h4>
            <h6 className="font-weight-bold"><b>This is an intensive task, do not refresh the tab :)</b></h6>
          </div>
            <Spinner className="mt-3" animation="border" role="status">
          </Spinner>
          </div>
      </div>

    )
  }
  else if (spinnerTest){
    return (
      <div className="flex justify-center container p-4 self-center">
        <div className="w-1/2 h-full ">
          <div>
            <h4 className="font-weight-bold"><b>Fetching the results and report...</b></h4>
            <h6 className="font-weight-bold"><b>This is an intensive task, do not refresh the tab :)</b></h6>
          </div>
            <Spinner className="mt-3" animation="border" role="status">
          </Spinner>
          </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center container p-4 self-center">
      <div className="w-1/2 h-full ">
      
      {/* {spinner ? <p>Loading...</p> : null} */}
        <Form.Label className="mb-4 align-center">Upload Customer Dataset</Form.Label>
        <br />
        <input className="align-center" type={"file"} id={"excel"} accept={".xlsx"} onChange={handleChange}></input>
        <br />
        <br />
        <Button className="m-2" variant="primary" type="submit" onClick={handleSubmitIncremental}>
          Submit for incremental learning
        </Button>
        <Button className="m-2" variant="primary" type="submit" onClick={handleSubmitTesting}>
          Submit for predicting results
        </Button>
      </div>
    </div >
  );
}

export default ContentDashboard;
