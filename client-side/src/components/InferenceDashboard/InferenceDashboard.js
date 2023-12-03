// import DashBoard from "../Dashboard/DashBoard";
import SideBar from "../Dashboard/SideBar";

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";
// import { useContext } from "react";
import { TestContext } from "../../contexts/TestContext";
import { useAuth } from "../../contexts/AuthContext";

// import SideBar from "./SideBar";
// import ContentDashboard from "./ContentDashboard";
import Form from "react-bootstrap/Form";
import FormSelect from "react-bootstrap/FormSelect";
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table';

function InferenceDashboard() {
  const { logout } = useAuth();
  const { setUser, user } = useContext(TestContext);
  const [queriesUpdate, setQueriesUpdate] = useState(0);
  // setQueries(1);
  // console.log("Dashboard queries, ", queriesUpdate);
  const navigate = useNavigate();
  // useEffect(() => {
  //   // console.log("dashboard useEffect new context");
  //   // console.log(user);
  //   if (!user) {
  //     navigate("/");
  //   }
  // }, [user, queriesUpdate]);

  // const testUser = {"firstName":"bruh","lastName":"yesyes","email":"yes@gmail.com"}
  const clf_report = {'0': {'precision': 0.9451612903225807, 'recall': 0.948220064724919, 'f1-score': 0.9466882067851373, 'support': 1236.0}, 
                          '1': {'precision': 0.8859180035650623, 'recall': 0.879646017699115, 'f1-score': 0.8827708703374777, 'support': 565.0}, 
                          'accuracy': 0.9267073847862298, 'macro avg': {'precision': 0.9155396469438215, 'recall': 0.913933041212017, 'f1-score': 0.9147295385613075, 'support': 1801.0}, 
                          'weighted avg': {'precision': 0.9265758061371293, 'recall': 0.9267073847862298, 'f1-score': 0.9266364049567489, 'support': 1801.0}}
  return (

    <div className="flex flex-row bg-neutral-100 w-screen h-screen">
      <SideBar
        handleLogout={logout}
        WelcomeUser={user}
        queriesUpdate={queriesUpdate}
        setQueriesUpdate={setQueriesUpdate}
      />
      <div className="flex container justify-center p-4">
        <div>
          <Table striped bordered hover variant= 'light'>
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
            <td>{Math.round(clf_report[0].precision*1000)/1000}</td>
            <td>{Math.round(clf_report[0].recall*1000)/1000}</td>
            <td>{Math.round(clf_report[0]["f1-score"]*1000)/1000}</td>
            <td>{clf_report[0].support}</td>
          </tr>
          <tr>
            <td>1</td>
            <td>{Math.round(clf_report[1].precision*1000)/1000}</td>
            <td>{Math.round(clf_report[1].recall*1000)/1000}</td>
            <td>{Math.round(clf_report[1]["f1-score"]*1000)/1000}</td>
            <td>{clf_report[1].support}</td>
          </tr>
          <tr>
            <td colSpan={5}></td>
          </tr>
          <tr>
            <th>Accuracy</th>
            <td colSpan={3}>{Math.round(clf_report.accuracy*1000)/1000}</td>
            <td>{clf_report["macro avg"].support}</td>
  
          </tr>
          <tr>
            <th>Macro Avg.</th>
            <td>{Math.round(clf_report["macro avg"].precision*1000)/1000}</td>
            <td>{Math.round(clf_report["macro avg"].recall*1000)/1000}</td>
            <td>{Math.round(clf_report["macro avg"]["f1-score"]*1000)/1000}</td>
            <td>{Math.round(clf_report["macro avg"].support*1000)/1000}</td>
            
          </tr>
          <tr>
            <th>Weighted Avg.</th>
            <td>{Math.round(clf_report["weighted avg"].precision*1000)/1000}</td>
            <td>{Math.round(clf_report["weighted avg"].recall*1000)/1000}</td>
            <td>{Math.round(clf_report["weighted avg"]["f1-score"]*1000)/1000}</td>
            <td>{Math.round(clf_report["weighted avg"].support*1000)/1000}</td>
          </tr>
        </tbody>
          </Table>  
        </div>
        <div>
            
        </div>
        <div className="w-1/2 h-full ">
          Labelled customer churn data:
          <Button className="m-2" variant="primary" type="submit">
            Download (.xlsx)
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InferenceDashboard;
