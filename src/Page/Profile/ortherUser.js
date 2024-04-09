import React, { useEffect, useState } from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBProgress,
    MDBProgressBar,
    MDBListGroup,
    MDBListGroupItem
} from 'mdb-react-ui-kit';
import Contact from '../../Components/Profile/Contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGithub, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import ItemCourse from '../../Components/Profile/ItemCourse';
import { useParams } from 'react-router-dom';

export default function ProfilePageOrther() {
    const {IdUser}=useParams();
    const [user,setUser]=useState(null);
    const [setting,SetSetting]=useState(false);
    const [save,setSave]=useState(false);
    const [listCourse,setListCourse]=useState([]);
    useEffect(()=>{
        const getDetailCouserUser = async ()=>{
            const dt=[];
            const getUser= await getDoc(doc(db,"users",IdUser));
            const idUser = getUser.data().id;
            const q = query(collection(db,"listCourseUser"),where("IdUser","==",idUser));
            const getCourse = await getDocs(q);
            getCourse.docs.forEach((item)=>{
                dt.push(item.data())
            })
            setListCourse(dt);
        }
        if(IdUser!==undefined)
        {
            const unsub = onSnapshot(doc(db, "users", IdUser), (doc) => {
                doc.exists() && setUser(doc.data());
              });
            return ()=>{
                unsub();
                getDetailCouserUser();
            }
        }
    },[IdUser])
    const checkSave = ()=>{
        setSave(false);
        SetSetting(false);
    }
    return (
        user &&
        <MDBContainer className="py-5">
            <MDBRow>
                <MDBCol lg="4">
                    <MDBCard className="mb-4">
                        <MDBCardBody className="text-center">
                            <MDBCardImage
                                src={user.photoURL}
                                alt="avatar"
                                className="rounded-circle ml-auto mr-auto mb-3"
                                style={{ width: '150px' }}
                                fluid/>
                            <p className="text-muted mb-1">{user.displayName}</p>
                            <p className="text-muted mb-4">{user.address}</p>
                        </MDBCardBody>
                    </MDBCard>

                    <MDBCard className="mb-4 mb-lg-0">
                        <MDBCardBody className="p-0">
                            <MDBListGroup flush className="rounded-3">
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon className='Icon' icon={faGithub} style={{color: 'black', height: 30}}/>
                                    <MDBCardText>mdbootstrap</MDBCardText>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon className='Icon' icon={faTwitter} style={{color: '#55acee', height: 30}}/>
                                    <MDBCardText>@mdbootstrap</MDBCardText>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon className='Icon' icon={faInstagram} style={{color: '#ac2bac', height: 30}}/>
                                    <MDBCardText>mdbootstrap</MDBCardText>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon className='Icon' icon={faFacebook} style={{color: 'blue', height: 30}}/>
                                    <MDBCardText>mdbootstrap</MDBCardText>
                                </MDBListGroupItem>
                            </MDBListGroup>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol lg="8">
                    <Contact user={user} setting={setting} save={save} checkSave={checkSave}></Contact>
                    <MDBRow>
                        <MDBCol md="6">
                            <MDBCard className="mb-4 mb-md-0">
                                <MDBCardBody style={{height: 400, overflowY: 'auto'}}>
                                    <MDBCardText className="mb-4">Các khóa học đã tham gia</MDBCardText>
                                    {
                                        listCourse.length>0 && 
                                        listCourse.map((item)=>(
                                            <ItemCourse item ={item}/>
                                        ))
                                    }
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        <MDBCol md="6">
                            <MDBCard className="mb-4 mb-md-0">
                                <MDBCardBody>
                                    <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status</MDBCardText>
                                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</MDBCardText>
                                    <MDBProgress className="rounded">
                                        <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                                    </MDBProgress>

                                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</MDBCardText>
                                    <MDBProgress className="rounded">
                                        <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                                    </MDBProgress>

                                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</MDBCardText>
                                    <MDBProgress className="rounded">
                                        <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                                    </MDBProgress>

                                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</MDBCardText>
                                    <MDBProgress className="rounded">
                                        <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                                    </MDBProgress>

                                    <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</MDBCardText>
                                    <MDBProgress className="rounded">
                                        <MDBProgressBar width={50} valuemin={0} valuemax={100} />
                                    </MDBProgress>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}