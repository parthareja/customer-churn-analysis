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
  const test_clf_report = {'0': {'precision': 0.9451612903225807, 'recall': 0.948220064724919, 'f1-score': 0.9466882067851373, 'support': 1236.0}, 
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
          <Table striped bordered hover variant= 'dark'>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
        </thead>
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
