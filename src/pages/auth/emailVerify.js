import { UserAuth } from "../../context/authContext";
import "../../styles/pages/auth/emailVerify.css";
import email from "../../styles/images/email.gif";
import { sendEmailVerification } from "firebase/auth";
import { message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const { user } = UserAuth();
  const Navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  
  const handleSubmit = async (e) => {
    try {
      await sendEmailVerification(user);
      messageApi.open({
        type: "success",
        content: "Email link resent succesfully",
      });
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  };
  const navigate = () => {
    Navigate("/login");
  };
  return (
    <>
      {contextHolder}
      <div className="verify-screen">
        <div className="verify-container">
          <h1>Verify your account</h1>
          <p>
            Account activation link has been sent to the e-mail address you
            provided
          </p>
          <div className="verify-container-details">
            <img src={email} alt=""></img>
            <p>
              Didn't get the mail?
              <span onClick={handleSubmit}> Send it again</span>
            </p>
            <div className="spacer"></div>
            <button onClick={navigate} type="">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerify;
