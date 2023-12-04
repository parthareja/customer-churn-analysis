import axios from "axios";
import { React, useContext, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormSelect from "react-bootstrap/FormSelect";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";
import { BsPassFill } from "react-icons/bs";
import { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";

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
  const [file, setFile] = useState();
  const [spinnerIncremental, setSpinnerIncremental] = useState(false);
  const [spinnerTest, setSpinnerTest] = useState(false);
  const [clsReport, setClsReport] = useState([]);
  const [clsDashboard, setClsDashboard] = useState(false);
  const [clsDashboardIncremental, setClsDashboardIncremental] = useState(false);
  const [download, setDownload] = useState([]);

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

  // const clsReport = {'0': {'precision': 0.9451612903225807, 'recall': 0.948220064724919, 'f1-score': 0.9466882067851373, 'support': 1236.0},
  //                         '1': {'precision': 0.8859180035650623, 'recall': 0.879646017699115, 'f1-score': 0.8827708703374777, 'support': 565.0},
  //                         'accuracy': 0.9267073847862298, 'macro avg': {'precision': 0.9155396469438215, 'recall': 0.913933041212017, 'f1-score': 0.9147295385613075, 'support': 1801.0},
  //                         'weighted avg': {'precision': 0.9265758061371293, 'recall': 0.9267073847862298, 'f1-score': 0.9266364049567489, 'support': 1801.0}}

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
    setFile(e.target.files[0]);
  };

  const handleSubmitTesting = async (e) => {
    setSpinnerTest(true);
    e.preventDefault();
    const reader = new FileReader();
    var file = document.getElementById("excel").files[0];

    const formDataExcel = new FormData();

    // formDataExcel.append("layer_name", layer_name);
    formDataExcel.append("excel_file", file);
    console.log("uploading");
    // setClsDashboard(true);
    // console.log(clsDashboard)
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
      const cls_data_string = res.headers.get("content-type");
      const clean_cls_data = cls_data_string.replace(/'/g, '"');
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "churn_predictions.csv");
      document.body.appendChild(link);
      setClsReport(JSON.parse(clean_cls_data));
      setDownload(link);
      setSpinnerTest(false);
      console.log(res.report);
      // navigate("/inferenceDashboard")
      setClsDashboard(true);
    });
  };

  const handleSubmitIncremental = async (e) => {
    setSpinnerIncremental(true);
    e.preventDefault();
    const reader = new FileReader();
    var file = document.getElementById("excel").files[0];

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
      // console.log(res);
      const cls_report = res.data.report;
      console.log(cls_report);
      setClsReport(cls_report);
      setClsDashboardIncremental(true);
      setSpinnerIncremental(false);
    });
  };

  const handleDownload = (e) => {
    download.click();
    download.remove();
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
  if (clsDashboard) {
    return (
      <div className="container justify-center">
        <div className="container justify-center p-4">
          <div className="m-20">
            <p className="mb-5">
              <h2>
                <b>Classification Report of the trained model</b>
              </h2>
            </p>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-Score</th>
                  <th>Support</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>{Math.round(clsReport[0].precision * 1000) / 1000}</td>
                  <td>{Math.round(clsReport[0].recall * 1000) / 1000}</td>
                  <td>{Math.round(clsReport[0]["f1-score"] * 1000) / 1000}</td>
                  <td>{clsReport[0].support}</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>{Math.round(clsReport[1].precision * 1000) / 1000}</td>
                  <td>{Math.round(clsReport[1].recall * 1000) / 1000}</td>
                  <td>{Math.round(clsReport[1]["f1-score"] * 1000) / 1000}</td>
                  <td>{clsReport[1].support}</td>
                </tr>
                <tr>
                  <td colSpan={5}></td>
                </tr>
                <tr>
                  <th>Accuracy</th>
                  <td colSpan={3}>
                    {Math.round(clsReport.accuracy * 1000) / 1000}
                  </td>
                  <td>{clsReport["macro avg"].support}</td>
                </tr>
                <tr>
                  <th>Macro Avg.</th>
                  <td>
                    {Math.round(clsReport["macro avg"].precision * 1000) / 1000}
                  </td>
                  <td>
                    {Math.round(clsReport["macro avg"].recall * 1000) / 1000}
                  </td>
                  <td>
                    {Math.round(clsReport["macro avg"]["f1-score"] * 1000) /
                      1000}
                  </td>
                  <td>
                    {Math.round(clsReport["macro avg"].support * 1000) / 1000}
                  </td>
                </tr>
                <tr>
                  <th>Weighted Avg.</th>
                  <td>
                    {Math.round(clsReport["weighted avg"].precision * 1000) /
                      1000}
                  </td>
                  <td>
                    {Math.round(clsReport["weighted avg"].recall * 1000) / 1000}
                  </td>
                  <td>
                    {Math.round(clsReport["weighted avg"]["f1-score"] * 1000) /
                      1000}
                  </td>
                  <td>
                    {Math.round(clsReport["weighted avg"].support * 1000) /
                      1000}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div></div>
          <div className="w-1/2 h-full justify-center">
            <b>Labelled customer churn data:</b>
            <Button
              className="ml-5"
              variant="primary"
              type="submit"
              onClick={handleDownload}
            >
              Download (.csv)
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (clsDashboardIncremental) {
    return (
      <div className="container justify-center">
        <div className="container justify-center p-4">
          <div className="m-20">
            <p className="mb-5">
              <h2>
                <b>Incremental Classification Report of the trained model</b>
              </h2>
            </p>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-Score</th>
                  <th>Support</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>{Math.round(clsReport[0].precision * 1000) / 1000}</td>
                  <td>{Math.round(clsReport[0].recall * 1000) / 1000}</td>
                  <td>{Math.round(clsReport[0]["f1-score"] * 1000) / 1000}</td>
                  <td>{clsReport[0].support}</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>{Math.round(clsReport[1].precision * 1000) / 1000}</td>
                  <td>{Math.round(clsReport[1].recall * 1000) / 1000}</td>
                  <td>{Math.round(clsReport[1]["f1-score"] * 1000) / 1000}</td>
                  <td>{clsReport[1].support}</td>
                </tr>
                <tr>
                  <td colSpan={5}></td>
                </tr>
                <tr>
                  <th>Accuracy</th>
                  <td colSpan={3}>
                    {Math.round(clsReport.accuracy * 1000) / 1000}
                  </td>
                  <td>{clsReport["macro avg"].support}</td>
                </tr>
                <tr>
                  <th>Macro Avg.</th>
                  <td>
                    {Math.round(clsReport["macro avg"].precision * 1000) / 1000}
                  </td>
                  <td>
                    {Math.round(clsReport["macro avg"].recall * 1000) / 1000}
                  </td>
                  <td>
                    {Math.round(clsReport["macro avg"]["f1-score"] * 1000) /
                      1000}
                  </td>
                  <td>
                    {Math.round(clsReport["macro avg"].support * 1000) / 1000}
                  </td>
                </tr>
                <tr>
                  <th>Weighted Avg.</th>
                  <td>
                    {Math.round(clsReport["weighted avg"].precision * 1000) /
                      1000}
                  </td>
                  <td>
                    {Math.round(clsReport["weighted avg"].recall * 1000) / 1000}
                  </td>
                  <td>
                    {Math.round(clsReport["weighted avg"]["f1-score"] * 1000) /
                      1000}
                  </td>
                  <td>
                    {Math.round(clsReport["weighted avg"].support * 1000) /
                      1000}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div></div>
        </div>
      </div>
    );
  } else if (spinnerIncremental) {
    return (
      <div className="flex justify-center container p-4 self-center">
        <div className="w-1/2 h-full ">
          <div>
            <h4 className="font-weight-bold">
              <b>Training your model...</b>
            </h4>
            <h6 className="font-weight-bold">
              <b>This is an intensive task, do not refresh the tab :)</b>
            </h6>
          </div>
          <Spinner className="mt-3" animation="border" role="status"></Spinner>
        </div>
      </div>
    );
  } else if (spinnerTest) {
    return (
      <div className="flex justify-center container p-4 self-center">
        <div className="w-1/2 h-full ">
          <div>
            <h4 className="font-weight-bold">
              <b>Fetching the results and report...</b>
            </h4>
            <h6 className="font-weight-bold">
              <b>This is an intensive task, do not refresh the tab :)</b>
            </h6>
          </div>
          <Spinner className="mt-3" animation="border" role="status"></Spinner>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center container p-4 self-center">
      <div className="w-1/2 h-full ">
        {/* {spinner ? <p>Loading...</p> : null} */}
        <Form.Label className="mb-4 align-center">
          Upload Customer Dataset
        </Form.Label>
        <br />
        <input
          className="align-center"
          type={"file"}
          id={"excel"}
          accept={".xlsx"}
          onChange={handleChange}
        ></input>
        <br />
        <br />
        <Button
          className="m-2"
          variant="primary"
          type="submit"
          onClick={handleSubmitIncremental}
        >
          Submit for incremental learning
        </Button>
        <Button
          className="m-2"
          variant="primary"
          type="submit"
          onClick={handleSubmitTesting}
        >
          Submit for predicting results
        </Button>
      </div>
    </div>
  );
}

export default ContentDashboard;
