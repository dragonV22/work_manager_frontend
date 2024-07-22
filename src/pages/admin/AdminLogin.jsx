import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const [adminemail, setAdminemail] = useState("");
  const [adminpassword, setAdminpassword] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();


  const handleAdminLogin = async () => {
    console.log(adminemail);
    const adminLoginResult = await auth.signin(
      {
        email: adminemail,
        password: adminpassword
      },
      () => {navigate('/admin')}
    );

    if(adminLoginResult) {
      setIsShowAlert(false);
    } else{
      setIsShowAlert(true);
    }
  }


  const handlePassShow =() => {
    setIsPasswordShow(!isPasswordShow);
  }

  return (
    <div className="container max-w-[500px] w-[90vw] flex flex-col gap-10 m-auto">
      <h2 className="text-3xl md:text-5xl font-bold text-black">
        AdminLogin
      </h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="form-label text-black font-semibold">
            Admin(メールアドレス)
          </p>
          <input
            type="text"
            className="text-black border border-solid border-[#33333333] w-full p-4"
            id="email"
            placeholder="Enter Email..."
            value={adminemail}
            onChange={(e) => setAdminemail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="form-label text-black font-semibold">
            パスワード
          </p>
          <div className="relative flex items-center">
            <input
              type={isPasswordShow ? "text" : "password"}
              className="text-black border border-solid border-[#33333333] w-full p-4"
              id="password"
              placeholder="Enter password..."
              value={adminpassword}
              onChange={(e) => setAdminpassword(e.target.value)}
            />
            <img className="absolute right-1" src={isPasswordShow ? "/assets/img/eye_off.png" : "/assets/img/eye.png"} onClick={handlePassShow} alt="eye" />
          </div>
        </div>
        <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${!isShowAlert && 'hidden'}`} role="alert">
            <strong className="font-bold">ログイン情報が正しくありません。</strong>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => (setIsShowAlert(false))}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
        </div>
        <button onClick={handleAdminLogin} className="text-white w-full bg-[#0EAAF0] p-2 rounded-sm transition duration-500 hover:bg-white hover:text-[#0EAAF0] hover:border hover:border-solid hover:border-[#0EAAF0]">
              ログイン
        </button>
      </div>  
    </div>
  )
}

export default AdminLogin;