import { Fragment, useEffect, useState } from "react";
import { axiosTokenApi } from "../../../utils/axios";
import { STATUS_LIST } from "../../../utils/const";
import { Dialog, Transition } from "@headlessui/react";
import ImageInput from "./ImageInput";
import { IoSend } from "react-icons/io5";
import { useAuth } from "../../../context/AuthContext";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import PropTypes from "prop-types";
import { getDaysInCurrentMonth } from "../../../utils/date";

import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";

const dayOfWeekMap = {
  Sun: "日",
  Mon: "月",
  Tue: "火",
  Wed: "水",
  Thu: "木",
  Fri: "金",
  Sat: "土",
};

const WorkAdminList = (props) => {
  const jobs = props.jobs;
  const auth = useAuth();

  const [open, setOpen] = useState(false);
  const [carNumber, setCarNumber] = useState(null);
  const [carState, setCarState] = useState(null);
  const [charger, setCharger] = useState("");
  const [budget, setBudget] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [isEdit, setIsEdit] = useState(true);
  const [jobId, setJobId] = useState(null);
  // original image url
  const [estimateOriginalImageUrl, setEstimateOriginalImageUrl] =
    useState(null);
  const [chargeOriginalImageUrl, setChargeOriginalImageUrl] = useState(null);
  const [workingOriginalImageUrl, setWorkingOriginalImageUrl] = useState(null);
  const [endOriginalImageUrl, setEndOriginalImageUrl] = useState(null);
  // result image url
  const [estimateResultImageUrl, setEstimateResultImageUrl] = useState(null);
  const [chargeResultImageUrl, setChargeResultImageUrl] = useState(null);
  const [workingResultImageUrl, setWorkingResultImageUrl] = useState(null);
  const [endResultImageUrl, setEndResultImageUrl] = useState(null);
  // original file
  const [estimateOriginalFile, setEstimateOriginalFile] = useState(null);
  const [chargeOriginalFile, setChargeOriginalFile] = useState(null);
  const [workingOriginalFile, setWorkingOriginalFile] = useState(null);
  const [endOriginalFile, setEndOriginalFile] = useState(null);
  // result file
  const [estimatResultFile, setEstimatResultFile] = useState(null);
  const [chargeResultFile, setChargeResultFile] = useState(null);
  const [workingResultFile, setWorkingResultFile] = useState(null);
  const [endResultFile, setEndResultFile] = useState(null);
  // message
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const [addStatus, setAddStatus] = useState("1");
  // date variable
  const [date, setDate] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);

  const [isDaily, setIsDaily] = useState(false);
  //add new status
  const [pickup, setPickup] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [workDetails, setWorkDetails] = useState(null);

  // setting days in this month
  useEffect(() => {
    const daysArray = getDaysInCurrentMonth(month, year);
    setDaysInMonth(daysArray);
  }, []);

  useEffect(() => {
    const daysArray = getDaysInCurrentMonth(month, year);
    setDaysInMonth(daysArray);

    // Filter requests based on selected month and year
    // const filtered = props.jobs.filter((request) => {
    //   const requestDate = new Date(request.deadline);
    //   return (
    //     requestDate.getMonth() === month && requestDate.getFullYear() === year
    //   );
    // });
    // setFilteredRequests(filtered);
  }, [month, year, props.jobs]);

  useEffect(() => {
    if (jobId) {
      const unSubscribe = onSnapshot(
        query(
          collection(
            db,
            "users",
            String("admin"),
            "jobs",
            String(jobId),
            "messages"
          ),
          orderBy("timestamp")
        ),
        (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => {
              const documentData = doc.data();
              return {
                id: doc.id,
                isAdmin: documentData.isAdmin,
                content: documentData.content,
              };
            })
          );
        }
      );

      return () => {
        unSubscribe();
      };
    }
  }, [auth, jobId]);

  const sendMessage = async () => {
    if (chatMessage === "") {
      return;
    }
    try {
      await addDoc(
        collection(
          db,
          "users",
          String("admin"),
          "jobs",
          String(jobId),
          "messages"
        ),
        {
          content: chatMessage,
          timestamp: new Date(),
          isAdmin: true,
        }
      );
      signMessages();

      await addDoc(
        collection(
          db,
          "users",
          String(userId),
          "jobs",
          String(jobId),
          "messages"
        ),
        {
          content: chatMessage,
          timestamp: new Date(),
          isAdmin: true,
        }
      );
      await setDoc(doc(db, "users", String(userId), "jobs", String(jobId)), {
        unreadCount: increment(1),
      });
      // contentRef.current?.scrollToBottom(500);
    } catch (error) {
      console.log(error);
    }
    setChatMessage("");
  };

  const signMessages = async () => {
    await setDoc(doc(db, "users", String("admin"), "jobs", String(jobId)), {
      unreadCount: 0,
    });
  };

  const openJobDetail = (_jobId) => {
    setIsEdit(true);
    setOpen(true);
    setJobId(_jobId);
    axiosTokenApi
      .get("api/job/job_detail/", { params: { job_id: _jobId } })
      .then((res) => {
        console.log(res.data);
        setCarNumber(res.data.car_number);
        setCharger(res.data.charger);
        setDeadline(res.data.deadline);
        setBudget(res.data.budget);
        setPickup(res.data.pickup);
        setDelivery(res.data.delivery);
        setWorkDetails(res.data.work_details);
        setCarState(res.data.status);
        setUserName(res.data.user.name);
        setTitle(res.data.title);
        setEstimateOriginalImageUrl(res.data.estimate_original_image_url);
        setChargeOriginalImageUrl(res.data.charge_original_image_url);
        setWorkingOriginalImageUrl(res.data.working_original_image_url);
        setEndOriginalImageUrl(res.data.end_original_image_url);
        // setOriginalFile(null);
        setEstimateResultImageUrl(res.data.estimate_result_image_url);
        setChargeResultImageUrl(res.data.charge_result_image_url);
        setWorkingResultImageUrl(res.data.working_result_image_url);
        setEndResultImageUrl(res.data.end_result_image_url);
        // setResultFile(null);
        setUserId(res.data.user.id);
        signMessages();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    const payload = {
      job_id: jobId,
      user: userId,
      status: carState,
    };

    if (carNumber) payload["car_number"] = carNumber;
    if (deadline) payload["deadline"] = deadline;
    if (charger) payload["charger"] = charger;
    if (budget) payload["budget"] = budget;
    if (title) payload["title"] = title;
    if (pickup) payload["pickup"] = pickup;
    if (delivery) payload["delivery"] = delivery;
    if (workDetails) payload["work_details"] = workDetails;
    // original image file part
    if (estimateOriginalFile)
      payload["estimate_original_image_url"] = estimateOriginalFile;
    if (chargeOriginalFile)
      payload["charge_original_image_url"] = chargeOriginalFile;
    if (workingOriginalFile)
      payload["working_original_image_url"] = workingOriginalFile;
    if (endOriginalFile) payload["end_original_image_url"] = endOriginalFile;
    // result image file part
    if (estimatResultFile)
      payload["estimate_result_image_url"] = estimatResultFile;
    if (chargeResultFile) payload["charge_result_image_url"] = chargeResultFile;
    if (workingResultFile)
      payload["working_result_image_url"] = workingResultFile;
    if (endResultFile) payload["end_result_image_url"] = estimatResultFile;

    axiosTokenApi
      .put("/api/job/jobs/", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        openJobDetail(jobId);
        props.getJobList();
      });

    setIsEdit(true);
  };

  const handleDelete = () => {
    try {
      axiosTokenApi.delete(`/api/job/jobs/${jobId}/`);
    } catch (error) {
      console.error("There was an error deleting the job:", error);
    }
  };

  const formatDayOfWeek = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDayOfWeekToJapan = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    return dayOfWeekMap[dayOfWeek];
  };

  const groupRequestsByDeadline = (requests) => {
    return requests.reduce((acc, request) => {
      const deadline = new Date(request.deadline).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!acc[deadline]) {
        acc[deadline] = [];
      }
      acc[deadline].push(request);
      return acc;
    }, {});
  };

  const requestsByDeadline = groupRequestsByDeadline(jobs);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handlePrevDay = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  return (
    <div className="flex flex-col gap-6 w-[90%] 2xl:w-7/12 border-[1px] p-2 rounded-sm relative">
      <h3 className="text-3xl font-semibold mt-12">作業一覧</h3>
      <div className="w-[90vw] lg:w-full overflow-auto lg:overflow-hidden">
        {isDaily && (
          <div className="flex w-full flex-col">
            <div className="mb-[20px] text-center bg-[#cf93e7] p-4">
              <label className="font-semibold">
                Month:
                <select
                  className="p-2 border-[1px] rounded-md ml-2"
                  value={month}
                  onChange={handleMonthChange}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(0, i).toLocaleString("en-US", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </label>
              <label className="ml-4 lg:ml-8">
                Year:
                <input
                  type="number"
                  className="p-2 ml-2 rounded-md"
                  value={year}
                  onChange={handleYearChange}
                />
              </label>
            </div>
            <div className="w-[860px] lg:w-full border-[1px] h-auto rounded-sm lg:rounded-md">
              <div className="flex flex-row">
                <div className="flex justify-center items-center min-w-16 lg:min-w-20">
                  {month + 1}
                </div>
                <div className="border-l-[1px]" />
                <div className="flex flex-wrap">
                  {daysInMonth.map((day, index) => (
                    <div
                      key={index}
                      className="flex flex-row w-full border-t-[1px]"
                    >
                      <div
                        className={`min-w-16 lg:min-w-20 border-r-[1px] p-2 flex justify-center items-center ${
                          day.getDay() === 0
                            ? "text-red-500"
                            : day.getDay() === 6
                            ? "text-blue-500"
                            : "black"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div
                        className={`min-w-16 lg:min-w-20 border-r-[1px] p-2 flex justify-center items-center ${
                          day.getDay() === 0
                            ? "text-red-500"
                            : day.getDay() === 6
                            ? "text-blue-500"
                            : "black"
                        }`}
                      >
                        {formatDayOfWeekToJapan(day)}
                      </div>
                      <div
                        className={`min-w-16 lg:min-w-20 border-r-[1px] p-2 flex justify-center items-center ${
                          day.getDay() === 0
                            ? "text-red-500"
                            : day.getDay() === 6
                            ? "text-blue-500"
                            : "black"
                        }`}
                      >
                        {formatDayOfWeek(day)}
                      </div>

                      <div
                        className={`flex flex-1 items-center ${
                          day.getDay() === 0
                            ? "text-red-500"
                            : day.getDay() === 6
                            ? "text-blue-500"
                            : "black"
                        }`}
                      >
                        <div className="flex flex-1 flex-row">
                          {requestsByDeadline[
                            day.toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          ]?.map((request, i) => (
                            <div
                              key={i}
                              className="w-auto bg-red-200 m-2 p-2 cursor-pointer rounded-sm lg:rounded-md"
                              onClick={() => {
                                openJobDetail(request.id);
                              }}
                            >
                              <p>{`no. ${i + 1}`}</p>
                              <p>{`担当者: ${request.charger}`}</p>
                              <p>{`締切日: ${request.deadline}`}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {!isDaily && (
          <div className="w-[860px] lg:w-full flex flex-col box-border ">
            <div className="w-full text-gray-100 bg-[#2596be]/60 h-10 flex justify-center items-center rounded-sm">
              TODAY'S SCHEDULE
            </div>
            <div className="w-full px-6 border-b-[1px] flex justify-center">
              <div className="flex items-center">
                <MdKeyboardArrowLeft size={30} onClick={handlePrevDay} />
              </div>
              <div className="font-semibold text-2xl flex items-center tracking-wide">
                {date.getMonth() + 1}月{date.getDate()}日(
                {formatDayOfWeekToJapan(date)})
              </div>
              <div className="flex items-center">
                <MdKeyboardArrowRight size={30} onClick={handleNextDay} />
              </div>
            </div>
            <div className="flex flex-1 flex-col w-full">
              {requestsByDeadline[
                date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              ]?.map((request, i) => (
                <div
                  key={i}
                  className="w-full bg-red-200 m-2 p-2 cursor-pointer rounded-sm lg:rounded-md flex flex-row gap-x-4 items-center"
                  onClick={() => {
                    openJobDetail(request.id);
                  }}
                >
                  <div className="w-1/12">{`no. ${i + 1}`}</div>
                  <div className="w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">{`担当者: ${request.charger}`}</div>
                  <div className="w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">{`顧客名: ${userName}`}</div>
                  <div className="w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">{`車名称: ${request.car_number}`}</div>
                  <div className="w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">{`作業内容: ${request.work_details}`}</div>
                  {/* <div>{`見積もり: ${request.budget}`}</div> */}
                  <div className="w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">
                    <div className="mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{`引取: ${request.pickup}`}</div>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis">{`納車: ${request.delivery}`}</div>
                  </div>
                  <div className="w-1/6 whitespace-nowrap overflow-hidden text-ellipsis">{`締切日: ${request.deadline}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          <div className="flex justify-between items-center">
                            <h2 className="text-[24px]">作業詳細</h2>
                            <button
                              onClick={() => setOpen(false)}
                              className="flex justify-center items-center w-[24px] h-[24px] p-0 hover:border-slate-200 rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M18 6L6 18M18 18L6 6.00001"
                                  stroke="#6E7475"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div>
                          <ul className="relative flex flex-col gap-3 border border-solid border-[#33333370] rounded-md p-2">
                            <li className="flex">
                              <p className="w-5/12">顧客名</p>
                              <p>{userName}</p>
                            </li>
                            <li className="flex">
                              <p className="w-5/12">車名称</p>
                              {isEdit ? (
                                <p>{carNumber}</p>
                              ) : (
                                <input
                                  type="text"
                                  className=" w-6/12"
                                  value={carNumber}
                                  onChange={(e) => setCarNumber(e.target.value)}
                                />
                              )}
                            </li>
                            <li className="flex">
                              <p className="w-5/12">ステータス</p>
                              {isEdit ? (
                                <p>{STATUS_LIST[carState - 1]}</p>
                              ) : (
                                <select
                                  className="border border-solid border-[#33333333] w-6/12 p-1"
                                  onChange={(e) => setCarState(e.target.value)}
                                >
                                  {STATUS_LIST.map((STATUS, index) => (
                                    <option
                                      key={`statys_option${index}`}
                                      selected={
                                        carState === index + 1 ? true : false
                                      }
                                      value={index + 1}
                                    >
                                      {STATUS}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </li>
                            <li className="flex">
                              <p className="w-5/12">担当者</p>
                              {isEdit ? (
                                <p>{charger}</p>
                              ) : (
                                <input
                                  type="text"
                                  className=" w-6/12"
                                  value={charger}
                                  onChange={(e) => setCharger(e.target.value)}
                                />
                              )}
                            </li>
                            <li className="flex">
                              <p className="w-5/12">見積もり</p>
                              {isEdit ? (
                                <p>{budget}</p>
                              ) : (
                                <input
                                  type="text"
                                  className="text-end w-6/12"
                                  value={budget}
                                  onChange={(e) => setBudget(e.target.value)}
                                />
                              )}
                            </li>
                            <li className="flex">
                              <p className="w-5/12">引取</p>
                              {isEdit ? (
                                <p>{pickup}</p>
                              ) : (
                                <input
                                  type="text"
                                  className=" w-6/12"
                                  value={pickup}
                                  onChange={(e) => setPickup(e.target.value)}
                                />
                              )}
                            </li>
                            <li className="flex">
                              <p className="w-5/12">納車</p>
                              {isEdit ? (
                                <p>{delivery}</p>
                              ) : (
                                <input
                                  type="text"
                                  className=" w-6/12"
                                  value={delivery}
                                  onChange={(e) => setDelivery(e.target.value)}
                                />
                              )}
                            </li>
                            <li className="flex">
                              <p className="w-5/12">作業内容</p>
                              {isEdit ? (
                                <p>{workDetails}</p>
                              ) : (
                                <input
                                  type="text"
                                  className=" w-6/12"
                                  value={workDetails}
                                  onChange={(e) =>
                                    setWorkDetails(e.target.value)
                                  }
                                />
                              )}
                            </li>
                            <li className="flex">
                              <p className="w-5/12">締切日</p>
                              {isEdit ? (
                                <p>{deadline}</p>
                              ) : (
                                <input
                                  type="date"
                                  className=" w-6/12"
                                  value={deadline}
                                  onChange={(e) => setDeadline(e.target.value)}
                                />
                              )}
                            </li>
                            <button
                              className="absolute -top-14 right-24 mr-2 bg-[#1677ff] text-white text-lg p-1 px-3"
                              onClick={handleDelete}
                            >
                              削除
                            </button>
                            {isEdit ? (
                              <button
                                className="absolute -top-14 right-8 bg-[#1677ff] text-white text-lg p-1 px-3"
                                onClick={() => {
                                  setIsEdit(false);
                                }}
                              >
                                編集
                              </button>
                            ) : (
                              <button
                                className="absolute -top-14 right-8 bg-[#1677ff] text-white text-lg p-1 px-3"
                                onClick={handleUpdate}
                              >
                                保存
                              </button>
                            )}
                          </ul>
                          <div className="flex flex-row items-center mt-16 gap-x-4">
                            <p>スターテス</p>
                            <select
                              className="w-4/12 border border-solid border-[#33333333] p-1"
                              onChange={(e) => setAddStatus(e.target.value)}
                            >
                              {STATUS_LIST.map((STATUS, index) => (
                                <option
                                  key={`statys_option${index}`}
                                  value={index + 1}
                                >
                                  {STATUS}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="border border-slate-400 flex flex-col justify-center items-start mt-4 p-4 rounded">
                            <p className="pb-2 text-lg">作業前画像</p>
                            {isEdit ? (
                              addStatus === "1" ? (
                                estimateOriginalImageUrl ? (
                                  <img
                                    className=" w-full rounded"
                                    src={estimateOriginalImageUrl}
                                    alt="Origin"
                                  />
                                ) : (
                                  <p className="pl-6">画像なし</p>
                                )
                              ) : addStatus === "2" ? (
                                chargeOriginalImageUrl ? (
                                  <img
                                    className=" w-full rounded"
                                    src={chargeOriginalImageUrl}
                                    alt="Origin"
                                  />
                                ) : (
                                  <p className="pl-6">画像なし</p>
                                )
                              ) : addStatus === "3" ? (
                                workingOriginalImageUrl ? (
                                  <img
                                    className=" w-full rounded"
                                    src={workingOriginalImageUrl}
                                    alt="Origin"
                                  />
                                ) : (
                                  <p className="pl-6">画像なし</p>
                                )
                              ) : endOriginalImageUrl ? (
                                <img
                                  className=" w-full rounded"
                                  src={endOriginalImageUrl}
                                  alt="Origin"
                                />
                              ) : (
                                <p className="pl-6">画像なし</p>
                              )
                            ) : addStatus === "1" ? (
                              <ImageInput
                                defaultAvatar={estimateOriginalImageUrl}
                                onUpload={setEstimateOriginalFile}
                              />
                            ) : addStatus === "2" ? (
                              <ImageInput
                                defaultAvatar={chargeOriginalImageUrl}
                                onUpload={setChargeOriginalFile}
                              />
                            ) : addStatus === "3" ? (
                              <ImageInput
                                defaultAvatar={workingOriginalImageUrl}
                                onUpload={setWorkingOriginalFile}
                              />
                            ) : (
                              <ImageInput
                                defaultAvatar={endOriginalImageUrl}
                                onUpload={setEndOriginalFile}
                              />
                            )}
                          </div>
                          <div className="border border-slate-400 flex flex-col justify-center items-start mt-4 p-4 rounded">
                            <p className="pb-2 text-lg">作業後画像</p>
                            {isEdit ? (
                              // estimateResultImageUrl ? (
                              //   <img
                              //     className=" w-full rounded"
                              //     src={estimateResultImageUrl}
                              //     alt="Result"
                              //   />
                              // ) : (
                              //   <p className="pl-6">画像なし</p>
                              // )
                              addStatus === "1" ? (
                                estimateResultImageUrl ? (
                                  <img
                                    className=" w-full rounded"
                                    src={estimateResultImageUrl}
                                    alt="Origin"
                                  />
                                ) : (
                                  <p className="pl-6">画像なし</p>
                                )
                              ) : addStatus === "2" ? (
                                chargeResultImageUrl ? (
                                  <img
                                    className=" w-full rounded"
                                    src={chargeResultImageUrl}
                                    alt="Origin"
                                  />
                                ) : (
                                  <p className="pl-6">画像なし</p>
                                )
                              ) : addStatus === "3" ? (
                                workingResultImageUrl ? (
                                  <img
                                    className=" w-full rounded"
                                    src={workingResultImageUrl}
                                    alt="Origin"
                                  />
                                ) : (
                                  <p className="pl-6">画像なし</p>
                                )
                              ) : endResultImageUrl ? (
                                <img
                                  className=" w-full rounded"
                                  src={endResultImageUrl}
                                  alt="Origin"
                                />
                              ) : (
                                <p className="pl-6">画像なし</p>
                              )
                            ) : addStatus === "1" ? (
                              <ImageInput
                                defaultAvatar={estimateResultImageUrl}
                                onUpload={setEstimatResultFile}
                              />
                            ) : addStatus === "2" ? (
                              <ImageInput
                                defaultAvatar={chargeResultImageUrl}
                                onUpload={setChargeResultFile}
                              />
                            ) : addStatus === "3" ? (
                              <ImageInput
                                defaultAvatar={workingResultImageUrl}
                                onUpload={setWorkingResultFile}
                              />
                            ) : (
                              <ImageInput
                                defaultAvatar={endResultImageUrl}
                                onUpload={setEndResultFile}
                              />
                            )}
                          </div>
                        </div>
                        <div className="mt-6">
                          <h3 className="text-left text-base font-bold py-4">
                            問い合わせ
                          </h3>
                          <div className="relative">
                            <div className="bg-[#33333320] rounded-xl flex flex-col gap-3 p-3 pb-20 h-[500px] overflow-y-auto scroll-smooth">
                              {messages &&
                                messages.map((message, index) => (
                                  <div
                                    key={`message_${index}`}
                                    className={`
                                    flex 
                                    ${
                                      message.isAdmin
                                        ? "justify-start"
                                        : "justify-end"
                                    }
                                  `}
                                  >
                                    <p
                                      className={`
                                    ${
                                      message.isAdmin
                                        ? "bg-white"
                                        : "bg-green-100"
                                    }
                                    shadow
                                    rounded-lg
                                    px-3
                                    py-1
                                    text-black
                                    text-[18px]
                                  `}
                                    >
                                      {message.content}
                                    </p>
                                  </div>
                                ))}
                            </div>
                            <div className="absolute bottom-2 left-2 bg-white p-2 w-[95%] flex justify-between items-center rounded-3xl">
                              <input
                                type="text"
                                className="w-9/12 outline-none border-none text-[18px]"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                              />
                              <IoSend
                                className={`cursor-pointer hover:scale-125`}
                                onClick={() => sendMessage()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="flex w-full absolute top-1 flex-row gap-x-4">
        <button
          className="min-w-[100px] max-w-full bg-[#cf93e7] hover:bg-[#cf93e7]/80 border-[#cf93ef]"
          onClick={() => setIsDaily(false)}
        >
          日別
        </button>
        <button
          className="min-w-[100px] max-w-full bg-[#cf93e7]"
          onClick={() => setIsDaily(true)}
        >
          月別
        </button>
      </div>
    </div>
  );
};

WorkAdminList.propTypes = {
  jobs: PropTypes.any,
  getJobList: PropTypes.any,
};

export default WorkAdminList;
