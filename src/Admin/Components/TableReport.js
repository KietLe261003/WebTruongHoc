import React, { useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

//Components
import { Button } from 'flowbite-react';
import { AuthContext } from '../../context/AuthContext';
import Modal from 'react-modal';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0px'
  },
};
const btnCheck={
  check: "px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300",
  unCheck: "px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
}
export default function TableReport(props) {
  const { currentUser } = useContext(AuthContext);
  const [report, setReport] = useState([]);


  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  // Sử dụng useState để giữ giá trị và cập nhật chúng
  const [records, setRecords] = useState([]);
  const [npage, setNPage] = useState(0);
  //const [numbers, setNumbers] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [urlImage,setUrlImage]=useState("");
  const closeModal = () => {
    setIsOpen(false);
  }
  useEffect(() => {
    const fetch = async () => {
      const getUser = await getDoc(doc(db, "users", currentUser.uid));
      if (getUser.exists()) {
        let q = collection(db, "reports");
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          const valu = doc.data();
          data.push(valu);
        });
        setReport(data);

        const data1=data.filter(item => item.type===1);
        setRecords(data1.slice(firstIndex, lastIndex));
        setNPage(Math.ceil(data1.length / recordsPerPage));
        //setNumbers([...Array(npage + 1).keys()].slice(1));
      }
    }
    fetch();
  }, [npage, firstIndex, lastIndex, currentUser])
  const handlePre = () => {
    setCurrentPage(currentPage - 1);
  }
  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  }
  const handleSearch = (txt) => {
    if (txt === "") {
      setRecords(report.slice(firstIndex, lastIndex));
      setNPage(Math.ceil(report.length / recordsPerPage));
    }
    else
      setRecords(report.filter(item => item.nameCourse.includes(txt) || item.teacher.includes(txt) || item.id.includes(txt)));
  }
  const fetch = async () => {
    const getUser = await getDoc(doc(db, "users", currentUser.uid));
    if (getUser.exists()) {
      let q = collection(db, "reports");
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        const valu = doc.data();
        data.push(valu);
      });
      setReport(data);
      const data1=data.filter(item => item.type===1);
      setRecords(data1.slice(firstIndex, lastIndex));
      setNPage(Math.ceil(data1.length / recordsPerPage));
      //setNumbers([...Array(npage + 1).keys()].slice(1));
      
    }
  }
  const handleCheck = async (data)=>{
      await updateDoc(doc(db,"reports",data),{
          status: 1
      })
      fetch();
  }
  const [checkBtn,setCheckBtn]=useState(0);
  const handleFilter = (e) =>{
    if(e===0)
    setRecords(report.filter(item => item.type===1));
    else if(e===1)
    setRecords(report.filter(item => item.type===2));
    else
    setRecords(report.filter(item => item.type===3));

    setCheckBtn(e);
}
  return (
    <section class="container px-4 mx-auto">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center gap-x-3">
            <h2 class="text-lg font-medium text-gray-800 dark:text-white">Customers</h2>

            <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">240 vendors</span>
          </div>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">These companies have purchased in the last 12 months.</p>
        </div>
        <div class="flex items-center mt-4 gap-x-3">
          <button class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_3098_154395)">
                <path d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_3098_154395">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span>Import</span>
          </button>

          <button class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <span>Add vendor</span>
          </button>
        </div>
      </div>

      <div class="mt-6 md:flex md:items-center md:justify-between">
        <div class="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
          <button onClick={()=>{handleFilter(0)}} class={checkBtn===0 ? btnCheck.check : btnCheck.unCheck}>
            Báo cáo bài viết
          </button>
          <button onClick={()=>{handleFilter(1)}} class={checkBtn===1 ? btnCheck.check : btnCheck.unCheck}>
            Báo cáo người dùng
          </button>
          <button onClick={()=>{handleFilter(2)}} class={checkBtn===2 ? btnCheck.check : btnCheck.unCheck}>
            Yêu cầu
          </button>
        </div>

        <div class="relative flex items-center mt-4 md:mt-0">
          <span class="absolute">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>

          <input type="text" onChange={(e) => { handleSearch(e.target.value) }} placeholder="Search" class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>
      </div>

      <div class="flex flex-col mt-6">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {
                      records.length > 0 && (records[0].type===1 || records[0].type===2) &&
                      <th scope="col" class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        Id Báo cáo
                      </th>
                    }
                    <th scope="col" class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Tiêu đề
                    </th>
                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Id User
                    </th>
                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Trang thái</th>
                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Loại</th>
                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 flex justify-center">Active</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {
                    records.map((item) => (
                      <tr>
                        {
                          (item.type===1 || item.type===2) &&
                          <td class="px-12 py-4 text-sm font-medium whitespace-nowrap">
                            <h4 class="text-gray-700 dark:text-gray-200">{item.idReport}</h4>
                          </td>
                        }
                        <td class="px-12 py-4 text-sm font-medium whitespace-nowrap">
                          <h4 class="text-gray-700 dark:text-gray-200">{item.content}</h4>
                        </td>
                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                          <div>
                            <h4 class="text-gray-700 dark:text-gray-200">{item.idUserReport}</h4>
                          </div>
                        </td>
                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                          <div class="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                            {item.status === 0 ? "Chưa kiểm tra" : "Đã kiểm tra"}
                          </div>
                        </td>
                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                          <div class="flex items-center ">
                            {item.type === 1 ? "Báo cáo bài viết" :
                              item.type === 2 ? "Báo cáo người dùng" : "Cấp quyền giáo viên"}
                          </div>
                        </td>
                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                          <div style={{ display: "flex", flexDirection: "row" }}>
                            <Button color="blue" onClick={() => { setIsOpen(true); setUrlImage(item.photoURL)}}>Minh Chứng</Button>
                            {
                              item.status===0 &&
                              <Button className=' bg-green-500' onClick={() => {handleCheck(item.id)}}>Check</Button> 
                            }
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div class="bg-blue-400" style={{
          height: "80px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}>
          <div style={{ flex: "0.5", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
            <p style={{ fontSize: 25, fontWeight: "bold" }}>Cv của người dùng</p>
          </div>
          <div style={{ flex: "0.5", display: "flex", flexDirection: "row-reverse", margin: 15 }} >
                        <button type="button" onClick={closeModal} class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
                            <span class="sr-only">Close</span>
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
        </div>
        <div style={{ width: 1000, height: 550 }}>
          <div style={{ height: '50', backgroundColor: 'black' }}></div>
          <img src={urlImage} alt='Ảnh cv hoặc chứng chỉ của người dùng'></img>
        </div>
      </Modal>
      <div class="mt-6 sm:flex sm:items-center sm:justify-between ">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Page <span class="font-medium text-gray-700 dark:text-gray-100">1 of 10</span>
        </div>
        <div class="flex items-center mt-4 gap-x-4 sm:mt-0">
          <button onClick={handlePre} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>

            <span>
              previous
            </span>
          </button>
          <button onClick={handleNext} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <span>
              Next
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}