import React, { useContext} from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';

import './App.css';
import Layout from './Components/Layout/Layout/Layout';
import Login from './Page/Login/Index.js';
import Home from './Page/Home/Index.js';
import Course from './Page/Course/Index.js';
import CourseOutline from './Page/Course_Outline/Index.js';
import Group from './Page/Group/Index.js';
import Class from './Page/Class/Index.js';
import Blog from './Page/Blog/Index.js';
import Profile from './Page/Profile/Index.js';
import Register from './Page/Login/Register.js';
import Admin from './Admin/Page/Index.js';
import ManagerUser from './Admin/Page/ManagerUser.js';
import ManagerCourse from './Admin/Page/ManagerCourse/ManagerCourse.js';
import NotFound from './Page/NotFound.js';
import {AuthContext} from './context/AuthContext.js';
import DetailCourse from './Admin/Page/ManagerCourse/DetailCourse.js';
import DashBoard from './Admin/Page/ManagerCourse/DashBoard.js';
import Learing from './Components/Learing/Learing.js';
import ListCourse from './Page/Course/ListCourse.js';
import DetailCourseUser from './Page/Course/DetailCourse.js';
import CompleCourse from './Page/Course/CompleCourse.js';
import ManagerCertificate from './Admin/Page/ManagerCertificate/ManagerCertificate.js';
import Certificate from './Admin/Page/ManagerCertificate/Certificate.js';
import DetailCertificate from './Admin/Page/ManagerCertificate/DetailCertificate.js';
import ListBlog from './Page/Blog/ListBlog.js';
import CreateBlog from './Page/Blog/CreateBlog.js';
import DetailBlog from './Page/Blog/DetailBlog.js';
import ManagerBlog from './Admin/Page/ManagerBlog/ManagerBlog.js';
import BlogAdmin from './Admin/Page/ManagerBlog/Blog.js';
import Compiler from './Page/Test.js';
import ProfilePageOrther from './Page/Profile/ortherUser.js';
import ManagerReport from './Admin/Page/ReportReques/ManagerReport.js';
import Report from './Admin/Page/ReportReques/Index.js';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();
function App() {
  const {currentUser} = useContext(AuthContext);
  const ProtectedRoute = ({children}) => {
    if(!currentUser)
    {
      return <Navigate to="/Login"/>
    }
    return children;
  }
  // async function getUser() {
  //   const docSnap = await getDoc(doc(db,"users",currentUser.uid));
  //   if(docSnap.exists())
  //   setUserInfor(docSnap.data());
  //   else
  //   console.log("Not found user");
  // }
  // const ProtectedRouteAdmin = ({children}) => {
  //   if(!currentUser)
  //   {
  //     return <Navigate to="/Login"/>
  //   }
  //   if(inforUser.role==="admin")
  //   return children;
  //   else
  //   return <Navigate to="/Login"/>
  
  // }
  return (
    <div className="App">
        <Routes>
            <Route path='/*' element={<ProtectedRoute><Layout/></ProtectedRoute> }>
              <Route index element={<Home/>}/>
              <Route path='test' element={<Compiler/>}/>
              <Route path='CourseOutline' element={<CourseOutline/>}/>
              <Route path='Course' element={<Course/>}>
                  <Route index element={<ListCourse/>}/>
                  <Route path='Detail/:id' element={<DetailCourseUser/>}/>
                  <Route path='CompleCourse/:idCourse' element={<CompleCourse/>}/>
              </Route>
              <Route path='Group' element={<Group/>}/>
              <Route path='Class' element={<Class/>}/>
              <Route path='Blog' element={<Blog/>}>
                  <Route index element={<ListBlog/>}></Route>
                  <Route path='CreateBlog' element={<CreateBlog/>}></Route>
              </Route>
              <Route path='DetailBlog/:idBlog' element={<DetailBlog/>}></Route>
              <Route path='Profile' element={<Profile/>}/>
              <Route path='ProfileOrther/:IdUser' element={<ProfilePageOrther/>}/>
            </Route>
            <Route path='/Login' element={<Login/>}/>
            <Route path='/Regiter' element={<Register/>}/>
            <Route path='/learing/:idActive/:idcourse' element={
              <ProtectedRoute>
                <Learing/>
              </ProtectedRoute>
            }/>
            {/* Admin page */}
            <Route path='/Admin/*' element={
              <ProtectedRoute>
                  <Admin />
              </ProtectedRoute>
            }>
              <Route path='ManagerUser' element={ <ManagerUser/>}/>
              <Route path='ManagerCourse' element={<ManagerCourse/>}>
                <Route index element={<DashBoard/>}/>
                <Route path='Detail/:id' element={<DetailCourse/>}/> 
              </Route> 
              <Route path='ManagerCertificate' element={<ManagerCertificate/>}>
                <Route index element={<Certificate/>}/>
                <Route path='Detail/:idCourse' element={<DetailCertificate/>}/>      
              </Route>
              <Route path='ManagerBlog' element={<ManagerBlog/>}>
                <Route index element={<BlogAdmin/>}/>    
              </Route>  
              <Route path='ManagerReport' element={<ManagerReport/>}>
                <Route index element={<Report/>}/>    
              </Route> 
            </Route>  
            <Route path='*' element={<NotFound></NotFound>}></Route> 
        </Routes>
    </div>
  );
}

export default App;
