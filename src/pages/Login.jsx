import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");
  const [isLogin, setLogin] = useState(true);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [telNumber, setTelNumber] = useState("");
  const [isErrLength, setErrLength] = useState(false);
  const [isErrPhoneLength, setIsErrPhoneLength] = useState(false);
  const [isErrSame, setErrSame] = useState(false);
  const navigate = useNavigate();
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isShowRegister, setIsShowRegister] = useState(false);

  const auth = useAuth();

  const loginBtn = async () => {
    const loginResult = await auth.signin(
      {
        email: email,
        password: password,
      },
      () => navigate("/")
    );

    if (loginResult) {
      setIsShowAlert(false);
    } else {
      setIsShowAlert(true);
    }
  };

  const registerBtn = async () => {
    if (password.length < 8) {
      setErrLength(true);
      return;
    }

    if (password !== password_confirm) {
      setErrSame(true);
      return;
    }

    if (telNumber.length < 13) {
      setIsErrPhoneLength(true);
      return;
    }

    const registerResult = await auth.signup(
      {
        email: email,
        password: password,
        tel: telNumber,
      },
      () => navigate("/")
    );

    if (registerResult) {
      setIsShowRegister(false);
    } else {
      setIsShowRegister(true);
    }
  };

  const handlePassShow = () => {
    setIsPasswordShow(!isPasswordShow);
  };
  const handleResister = () => {
    setEmail("");
    setPassword("");
    setLogin(false);
  };
  const handleLogin = () => {
    setEmail("");
    setPassword("");
    setTelNumber("");
    setPasswordConfirm("");
    setErrLength(false);
    setErrSame(false);
    setLogin(true);
  };
  return (
    <div className="container flex flex-col p-3 items-center justify-center w-full h-full m-auto md:flex-row md:p-0">
      <div className="w-full md:w-6/12 flex flex-col gap-3">
        {isLogin ? (
          <h1 className="text-black font-bold text-4xl">ログイン</h1>
        ) : (
          <h1 className="text-black font-bold text-4xl">新規会員登録</h1>
        )}

        <br />
        <div
          className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${
            !isShowAlert && "hidden"
          }`}
          role="alert"
        >
          <strong className="font-bold">
            ログイン情報が正しくありません。
          </strong>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setIsShowAlert(false)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
        <div
          className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${
            !isShowRegister && "hidden"
          }`}
          role="alert"
        >
          <strong className="font-bold">
            すでに登録されているか、メールアドレスが正しくありません。
          </strong>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setIsShowRegister(false)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
        <p className="form-label text-black p-2">ユーザー名(メールアドレス)</p>
        <input
          type="email"
          className="text-black border border-solid border-[#33333333] w-full p-2"
          id="email"
          placeholder="Enter Email..."
          autoComplete="new-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {isLogin ? (
          <div className="flex flex-col gap-3">
            <p className="text-black p-2">パスワード</p>
            <div className="password relative flex items-center">
              <input
                type={isPasswordShow ? "text" : "password"}
                className="text-black border border-solid border-[#33333333] w-full p-2"
                id="password"
                autoComplete="new-password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                className="absolute right-1"
                src={
                  isPasswordShow
                    ? "/assets/img/eye_off.png"
                    : "/assets/img/eye.png"
                }
                onClick={handlePassShow}
                alt="eye"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <p className="text-black w-full p-2">電話番号</p>
              <input
                type="text"
                className="text-black border border-solid border-[#33333333] w-full p-2"
                value={telNumber}
                onChange={(e) => setTelNumber(e.target.value)}
              />
              {isErrPhoneLength && (
                <div>
                  <p className="text-xs text-[#ff4444] font-semibold">
                    電話番号は13文字以上でなければなりません。
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-black w-full p-2">パスワード</p>
              <div className="password relative flex items-center">
                <input
                  type={isPasswordShow ? "text" : "password"}
                  className="text-black border border-solid border-[#33333333] w-full p-2"
                  id="password"
                  autoComplete="new-password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  className="absolute right-1"
                  src={
                    isPasswordShow
                      ? "/assets/img/eye_off.png"
                      : "/assets/img/eye.png"
                  }
                  onClick={handlePassShow}
                  alt="eye"
                />
              </div>
              {isErrLength && (
                <div>
                  <p className="text-xs text-[#ff4444] font-semibold">
                    パスワードは8文字以上でなければなりません。
                  </p>
                </div>
              )}
              <p className="text-black w-full p-2">パスワード（確認用）</p>
              <div className="password relative flex items-center">
                <input
                  type={isPasswordShow ? "text" : "password"}
                  className="text-black border border-solid border-[#33333333] w-full p-2"
                  id="password"
                  placeholder="Enter password..."
                  value={password_confirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <img
                  className="absolute right-1"
                  src={
                    isPasswordShow
                      ? "/assets/img/eye_off.png"
                      : "/assets/img/eye.png"
                  }
                  onClick={handlePassShow}
                  alt="eye"
                />
              </div>
              {isErrSame && (
                <div>
                  <p className="text-xs text-[#ff4444] font-semibold">
                    パスワードが一致しません。
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {isLogin ? (
          <button
            onClick={loginBtn}
            className="text-white w-full bg-[#0EAAF0] p-2 rounded-sm transition duration-500 hover:bg-white hover:text-[#0EAAF0] hover:border hover:border-solid hover:border-[#0EAAF0]"
          >
            ログイン
          </button>
        ) : (
          <button
            onClick={registerBtn}
            className="text-white w-full bg-[#0EAAF0] p-2 rounded-sm hover:border-solid transition duration-300 hover:bg-white hover:text-[#0EAAF0] hover:border hover:border-[#0EAAF0]"
          >
            送信
          </button>
        )}
        <div className="mb-3 text-black">
          {isLogin ? (
            <h5>
              はじめてご利用の方 <br />
              <br />
              <button
                className="bg-white text-[#0EAAF0] w-full border-solid border border-[#0EAAF0] p-2 rounded-sm transition duration-300 hover:text-white hover:bg-[#0EAAF0] hover:border-none"
                onClick={handleResister}
              >
                アカウントを作成する
              </button>
            </h5>
          ) : (
            <h5>
              アカウントすでにお持ちの方
              <button
                className="bg-white text-[#0EAAF0] w-full border-solid border border-[#0EAAF0] p-2 rounded-sm transition duration-300 hover:text-white hover:bg-[#0EAAF0] hover:border-none"
                onClick={handleLogin}
              >
                ログイン
              </button>
            </h5>
          )}
        </div>
      </div>
      <div className="w-full p-3 flex justify-center item-center md:w-6/12">
        <img
          className="rounded-3xl"
          src="/assets/img/login_img.jpeg"
          alt="login_img"
        ></img>
      </div>
    </div>
  );
};

export default Login;
