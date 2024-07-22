import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";

import { axiosTokenApi } from "../../utils/axios";
import ClientList from "../../components/admin/home/clientlist";
import WorkAdminList from "../../components/admin/home/worklist";


const AdminHome = () => {
  const auth = useAuth();
  
  const [jobs, setJobs] = useState([]);

  
  useEffect(() => {
    getJobList();
  }, [])

	useEffect(() => {
		const unSubscribe = onSnapshot(
			query(
				collection(
					db,
					"users",
					String("admin"),
					"jobs",
				),
			),
			async (snapshot) => {
        const res = await axiosTokenApi.get("/api/job/jobs/");
        let _jobs = res.data.map(job => {
          let isUnread = false;
          snapshot.forEach(doc => {
            const documentData = doc.data()
            if(documentData.unreadCount && parseInt(job.id) === parseInt(doc.id)) {
              isUnread = true;
            }
          })
          return { ...job, isUnread: isUnread }
        });
        setJobs(_jobs);
			}
		);

		return () => {
			unSubscribe();
		};
	}, [auth])

  const getJobList = () => {
    axiosTokenApi
      .get("/api/job/jobs/")
      .then(res => {
        setJobs(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div className="p-4 w-full flex flex-col 2xl:flex-row gap-4 gap-y-20 2xl:gap-4 items-center 2xl:items-start">
       <ClientList getJobList={getJobList} />
       <WorkAdminList jobs={jobs} getJobList={getJobList} />
    </div>
  )
}

export default AdminHome;