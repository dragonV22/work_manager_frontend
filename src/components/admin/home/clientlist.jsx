import { useEffect, useState } from "react";
import { axiosTokenApi } from "../../../utils/axios";
import moment from 'moment';
import { STATUS_LIST } from "../../../utils/const";
import Modal from "antd/es/modal/Modal";
import PropTypes from 'prop-types';

const ClientList = (props) => {

  const [users, setUsers] = useState([]);
  const [userName , setUserName] = useState("");
  const [isValidName , setIsValidName] = useState(true);
  const [nameError , setNameError] = useState('');
  const [userAddress , setUserAddress] = useState("");
  const [userTel , setUserTel] = useState("");
  const [isValidTel , setIsValidTel] = useState(true);
  const [telError , setTelError] = useState('');
  const [userEmail , setUserEmail] = useState("");
  const [isValidEmail , setIsValidEmail] = useState(true);
  const [emailError , setEmailError] = useState('');
  const [openModal , setOpenModal] = useState(false);
  const [jobUser , setJobUser] = useState([]);
  const [isEdit , setEdit] = useState(true);
  const [userId , setUserId] = useState("");
  const [addJob , setAddJob] = useState(true);
  const [addCarnumber , setAddCarnumber] = useState(null);
  const [isValidJob , setIsValidJob] = useState(true);
  const [jobError , setJobError] = useState("");
  const [addStatus , setAddStatus] = useState(1);
  const [addDate , setAddDate] = useState(null)
  const [addCharger , setAddCharger] = useState(null);
  const [addTitle , setAddTitle] = useState(null);
  const [addBudget , setAddBudget] = useState(null);

  useEffect(() => {
    getProfile();
  }, [addCarnumber])

  const getProfile = () => {
    axiosTokenApi
      .get("/api/auth/user_list/")
      .then(res => {
          setUsers(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const userDetail = (userId) => {
    setUserId(userId);
    setOpenModal(true);

    axiosTokenApi
      .get("/api/auth/user_detail/" , { params : {user_id: userId}})
      .then(res => {
        setUserName(res.data.user.name);
        setUserAddress(res.data.user.address);
        setUserTel(res.data.user.tel);
        setUserEmail(res.data.user.email);
        setJobUser(res.data.jobs);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleUpdate = () => {
    
    axiosTokenApi
      .post("api/auth/user_update/" , {
        user_id: userId,
        name : userName,
        address : userAddress,
        tel : userTel,
        email : userEmail,
      })
      .then(() => {
        getProfile();
        setEdit(true);
        setEmailError("");
        setNameError("");
        setTelError("");
      })
      .catch(err => {
        const ret = err.response.data;
				
				if(ret.email) {
					setEmailError(ret.email);
					setIsValidEmail(false);
				} else{
					setEmailError('');
					setIsValidEmail(true);
				}

				if(ret.name) {
					setNameError(ret.name);
					setIsValidName(false);
				} else{
					setNameError('');
					setIsValidName(true);
				}

				if(ret.tel) {
					setTelError(ret.tel);
					setIsValidTel(false);
				} else{
					setTelError('');
					setIsValidTel(true);
				}
      })
    
  }

  const handleAddJob = () => {
    let payload = {
      user : userId,
      car_number : addCarnumber,
      status : addStatus,
    }
    if(addTitle) payload['title'] = addTitle;
    if(addCharger) payload['charger'] = addCharger;
    if(addBudget) payload['budget'] = addBudget;
    if(addDate) payload['deadline'] = addDate;
    axiosTokenApi
      .post("api/job/jobs/" , payload)
      .then(() => {
        setAddCarnumber(null);
        setAddStatus(1);
        setAddDate(null);
        setAddCharger(null);
        setAddTitle(null);
        setAddBudget(null);
        getProfile();
        setAddJob(true);
      })
      .catch((err) => {
        const ret = err.response.data;

        if(ret.car_number || ret.title || ret.deadline){
          setJobError("この項目は空にできません。");
          setIsValidJob(false);
        }
      })
    userDetail(userId);
    
    props.getJobList()
  }

  const handleCancel = () => {
    setEdit(true);
    setAddJob(true);
    setOpenModal(false);
    setIsValidEmail(false);
    setIsValidEmail(true);
    setIsValidName(true);
    setIsValidTel(true);
    setJobError('');
  }

  return(
    <div className="flex flex-col gap-6 w-[90%] 2xl:w-5/12">
      <h3 className="text-3xl font-semibold">
        顧客一覧
      </h3>
      <div className="w-[90vw] lg:w-full overflow-auto lg:overflow-hidden">
        <table className="w-[860px] lg:w-full table-fixed">
          <thead>
            <tr>
              <th className="w-[60px]">No</th>
              <th>Eメール</th>
              <th>名前</th>
              <th>電話番号</th>
              <th>登録日</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr className="cursor-pointer" key={index} onClick={() => {userDetail(user.id)}}>
                <td>{index+1}</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.tel}</td>
                <td>{moment(user.created_at).format("YYYY-MM-DD")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          title={<p className="font-semibold text-2xl">顧客詳細</p>}
          centered
          open={openModal}
          className="max-w-[700px]"
          width={'95vw'}
          onCancel={handleCancel}
          footer={null}
        >
          <div className="border-b border-solid border-b-[#33333333] relative pb-3">
            <ul className="flex flex-col gap-3 mt-5">
              <li className="flex items-center">
                <p className="w-1/3">
                  名前
                </p>
                <div className="w-1/2">
                  {isEdit ? 
                    <p className="w-full">{userName} </p>: 
                    <input className="w-full" value={userName} onChange={(e) => setUserName(e.target.value)} 
                  />}
                  {isValidName === false &&
										<p className='pl-2 text-xs text-red-500'>{nameError}</p>
									}
                </div>
              </li>
              <li className="flex items-center">
                <p className="w-1/3">
                住所
                </p>
                <div className="w-1/2">
                  {isEdit ? 
                    <p className="w-full">
                      {userAddress}
                    </p>  :
                    <input className="w-full" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
                  }

                </div>
                
              </li>
              <li className="flex items-center">
                <p className="w-1/3">
                電話番号
                </p>
                <div className="w-1/2">
                  {isEdit ?
                    <p className="w-full">
                      {userTel}
                    </p> :
                    <input className="w-full" value={userTel} onChange={(e) => setUserTel(e.target.value)} />
                  }
                  {isValidTel === false &&
										<p className='pl-2 text-xs text-red-500'>{telError}</p>
									}
                </div>
              </li>
              <li className="flex items-center">
                <p className="w-1/3">
                メールアドレス
                </p>
                <div className="w-1/2">
                  {isEdit ?
                    <p className="w-full">
                      {userEmail}
                    </p> :
                    <input className="w-full" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                  }
                  {isValidEmail === false &&
										<p className='pl-2 text-xs text-red-500'>{emailError}</p>
									}
                </div>
                
              </li>
            </ul>
            {isEdit ?
              <button className="absolute -top-14 right-6 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={() => setEdit(false)}>編集</button>
              :
              <button className="absolute -top-14 right-6 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={handleUpdate}>保存</button>
            }
          </div>
          <div className="mt-5 flex flex-col gap-5 relative">
            <h6 className="font-semibold text-2xl">
            作業
            </h6>
            <div className="p-2 flex flex-col gap-3">
              <ul className="flex justify-between gap-1 border-b border-solid border-[#33333333]">
                <li className="w-2/12 font-bold">
                  車番号
                </li>
                <li className="w-2/12 font-bold">
                 担当者
                </li>
                {/* <li className="w-3/12 font-bold">
                  工程
                </li> */}
                <li className="w-4/12 font-bold">
                  ステータス
                </li>
                <li className="w-3/12 font-bold">
                  見積額
                </li>
                <li className="w-4/12 font-bold">
                 締切日
                </li>
              </ul>
              {jobUser.map((job,index) => (
                <ul key = {index} className="flex justify-between gap-1">
                  <li className="w-2/12">
                    {job.car_number}
                  </li>
                  <li className="w-2/12">
                    {job.charger}
                  </li>
                  {/* <li className="w-3/12">
                    {job.title}
                  </li> */}
                  <li className="w-4/12">
                    {STATUS_LIST[job.status - 1]}
                  </li>
                  <li className="w-3/12">
                    {job.budget}
                  </li>
                  <li className="w-4/12">
                    {job.deadline}
                  </li>
                </ul>
              ))}
              {addJob ? 
                <div>
                  
                </div>
                :
                <div>
                  <div className="flex justify-between gap-1">
                    <input type="text" className="w-2/12" onChange={(e) => setAddCarnumber(e.target.value)}/>
                    <input type="text" className="w-2/12" onChange={(e) => setAddCharger(e.target.value)}/>
                    {/* <input type="text" className="w-3/12" onChange={(e) => setAddTitle(e.target.value)}/> */}
                    <select className="w-4/12 border border-solid border-[#33333333] p-1" onChange={(e) => setAddStatus(e.target.value)}>
                      {STATUS_LIST.map((STATUS, index) => (
                        <option key={`statys_option${index}`} value={index+1}>{STATUS}</option>
                      ))}
                    </select>
                    <input type="text" className="text-end w-3/12" onChange={(e) => setAddBudget(e.target.value)}/>
                    <input type="date" className="w-4/12" onChange={(e) => setAddDate(e.target.value)}/>
                  </div>
                  {isValidJob === false &&
                    <p className='pl-2 text-xs text-red-500'>{jobError}</p>
                  }
                </div>
              }
              
            </div>
            {
              addJob ? 
              <button className="absolute top-0 right-5 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={() => setAddJob(false)}>作業登録</button>
              :
              <button className="absolute top-0 right-5 bg-[#1677ff] text-white text-lg p-1 px-3" onClick={handleAddJob}>追加する</button>
            }
          </div>
        </Modal>
      </div>
    </div>
  )
}

ClientList.propTypes = {
  getJobList: PropTypes.any
};

export default ClientList;