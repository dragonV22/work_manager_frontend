import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { axiosTokenApi } from "../../../utils/axios";
import { STATUS_LIST } from "../../../utils/const";
import { db } from "../../../firebase";
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
import { useAuth } from "../../../context/AuthContext";
import { IoSend } from "react-icons/io5";

const Worklist = () => {
  const auth = useAuth();
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");

  const [addStatus, setAddStatus] = useState("1");

  useEffect(() => {
    axiosTokenApi
      .get("/api/job/user_jobs/")
      .then((res) => {
        setJobs(res.data.map((job) => ({ ...job, isUnread: false })));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const unSubscribe = onSnapshot(
      query(collection(db, "users", String(auth.user.id), "jobs")),
      async (snapshot) => {
        const res = await axiosTokenApi.get("/api/job/user_jobs/");
        let _jobs = res.data.map((job) => {
          let isUnread = false;
          snapshot.forEach((doc) => {
            const documentData = doc.data();
            if (
              documentData.unreadCount &&
              parseInt(job.id) === parseInt(doc.id)
            ) {
              isUnread = true;
            }
          });
          return { ...job, isUnread: isUnread };
        });
        setJobs(_jobs);
      }
    );

    return () => {
      unSubscribe();
    };
  }, [auth]);

  useEffect(() => {
    if (selectedJob) {
      const unSubscribe = onSnapshot(
        query(
          collection(
            db,
            "users",
            String(auth.user.id),
            "jobs",
            String(selectedJob.id),
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
  }, [auth, selectedJob]);

  const sendMessage = async () => {
    if (chatMessage === "") {
      return;
    }
    try {
      await addDoc(
        collection(
          db,
          "users",
          String(auth.user.id),
          "jobs",
          String(selectedJob.id),
          "messages"
        ),
        {
          content: chatMessage,
          timestamp: new Date(),
          isAdmin: false,
        }
      );
      signMessages();

      await addDoc(
        collection(
          db,
          "users",
          String("admin"),
          "jobs",
          String(selectedJob.id),
          "messages"
        ),
        {
          content: chatMessage,
          timestamp: new Date(),
          isAdmin: false,
        }
      );
      await setDoc(
        doc(db, "users", String("admin"), "jobs", String(selectedJob.id)),
        {
          unreadCount: increment(1),
        }
      );
      // contentRef.current?.scrollToBottom(500);
    } catch (error) {
      console.log(error);
    }
    setChatMessage("");
  };

  const signMessages = async () => {
    await setDoc(
      doc(db, "users", String(auth.user.id), "jobs", String(selectedJob.id)),
      {
        unreadCount: 0,
      }
    );
  };

  const openModal = (jobId) => {
    setOpen(true);

    axiosTokenApi
      .get("api/job/job_detail/", { params: { job_id: jobId } })
      .then((res) => {
        setSelectedJob(res.data);
        signMessages();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="relative w-full md:w-[28%]">
      <h2 className="text-right text-[24px] font-semibold">作業一覧</h2>
      <div className="w-full p-10 border border-solid border-[#33333333] rounded-xl flex flex-col gap-5">
        <ul className="flex flex-col gap-4 items-center">
          {jobs.map((job, index) => (
            <li
              className="w-fit text-[20px] cursor-pointer relative"
              onClick={() => {
                openModal(job.id);
              }}
              key={`car_${index}`}
            >
              {job.car_number}
              {job.isUnread && (
                <span className="absolute -right-3 top-1 w-3 h-3 rounded-full bg-red-500"></span>
              )}
            </li>
          ))}
        </ul>
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
                            <ul className="border border-solid border-[#33333370] rounded-md p-2">
                              <li className="flex">
                                <p className="w-6/12"> 車番号: </p>
                                {selectedJob ? selectedJob.car_number : ""}
                              </li>
                              <li className="flex">
                                <p className="w-6/12"> ステータス: </p>
                                {selectedJob
                                  ? STATUS_LIST[selectedJob.status - 1]
                                  : ""}
                              </li>
                              {/* <li className="flex"><p className="w-6/12"> 見積もり: </p>{selectedJob ? selectedJob.budget : ''}円</li> */}
                              <li className="flex">
                                <p className="w-6/12"> 担当者: </p>
                                {selectedJob ? selectedJob.charger : ""}
                              </li>
                              <li className="flex">
                                <p className="w-6/12"> 締切日: </p>
                                {selectedJob ? selectedJob.deadline : ""}
                              </li>
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
                              {/* {selectedJob && selectedJob.original_image_url ? (
                                <img
                                  className=" w-full rounded"
                                  src={selectedJob.original_image_url}
                                  alt="Origin"
                                />
                              ) : (
                                <p className="pl-6">画像なし</p>
                              )} */}
                              {selectedJob &&
                                (addStatus === "1" ? (
                                  selectedJob.estimate_original_image_url ? (
                                    <img
                                      className=" w-full rounded"
                                      src={selectedJob.estimate_original_image_url}
                                      alt="Origin"
                                    />
                                  ) : (
                                    <p className="pl-6">画像なし</p>
                                  )
                                ) : addStatus === "2" ? (
                                  selectedJob.charge_original_image_url ? (
                                    <img
                                      className=" w-full rounded"
                                      src={selectedJob.charge_original_image_url}
                                      alt="Origin"
                                    />
                                  ) : (
                                    <p className="pl-6">画像なし</p>
                                  )
                                ) : addStatus === "3" ? (
                                  selectedJob.working_original_image_url ? (
                                    <img
                                      className=" w-full rounded"
                                      src={selectedJob.working_original_image_url}
                                      alt="Origin"
                                    />
                                  ) : (
                                    <p className="pl-6">画像なし</p>
                                  )
                                ) : selectedJob.end_original_image_url ? (
                                  <img
                                    className=" w-full rounded"
                                    src={selectedJob.end_original_image_url}
                                    alt="Origin"
                                  />
                                ) : (
                                  <p className="pl-6">画像なし</p>
                                ))}
                            </div>
                            <div className="border border-slate-400 flex flex-col justify-center items-start mt-4 p-4 rounded">
                              <p className="pb-2 text-lg">作業後画像</p>
                              {selectedJob && (addStatus === "1" ? (
                                  selectedJob.estimate_result_image_url ? (
                                    <img
                                      className=" w-full rounded"
                                      src={selectedJob.estimate_result_image_url}
                                      alt="Origin"
                                    />
                                  ) : (
                                    <p className="pl-6">画像なし</p>
                                  )
                                ) : addStatus === "2" ? (
                                  selectedJob.charge_result_image_url ? (
                                    <img
                                      className=" w-full rounded"
                                      src={selectedJob.charge_result_image_url}
                                      alt="Origin"
                                    />
                                  ) : (
                                    <p className="pl-6">画像なし</p>
                                  )
                                ) : addStatus === "3" ? (
                                  selectedJob.working_result_image_url ? (
                                    <img
                                      className=" w-full rounded"
                                      src={selectedJob.working_result_image_url}
                                      alt="Origin"
                                    />
                                  ) : (
                                    <p className="pl-6">画像なし</p>
                                  )
                                ) : selectedJob.end_result_image_url ? (
                                  <img
                                    className=" w-full rounded"
                                    src={selectedJob.end_result_image_url}
                                    alt="Origin"
                                  />
                                ) : (
                                  <p className="pl-6">画像なし</p>
                                ))}
                            </div>
                          </div>
                          <div className="mt-6">
                            <h3 className="text-left text-base font-bold py-4">
                              問い合わせ
                            </h3>
                            <div className="relative">
                              <div className="bg-[#33333320] rounded-xl flex flex-col gap-3 p-3 h-[500px] overflow-y-auto scroll-smooth pb-20 scrollwidth">
                                {messages &&
                                  messages.map((message, index) => (
                                    <div
                                      key={`message_${index}`}
                                      className={`
																			flex 
																			${message.isAdmin ? "justify-end" : "justify-start"}
																		`}
                                    >
                                      <p
                                        className={`
																			${message.isAdmin ? "bg-green-100" : "bg-white"}
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
                                  onChange={(e) =>
                                    setChatMessage(e.target.value)
                                  }
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
      </div>
      <div className="absolute top-[-20px] left-0 w-20">
        <img
          className="bg-white"
          src="/assets/img/repair_img.png"
          alt="profile_img"
        />
      </div>
    </div>
  );
};

export default Worklist;
