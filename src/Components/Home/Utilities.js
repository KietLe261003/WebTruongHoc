import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faNewspaper, faBriefcase, faCheck, faUser, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
function Utilities() {
    return (<div className='IntroVideo' style={{ marginTop: 50 }}>
        <h1 className='titleNews' style={{ marginBottom: 50 }}>Chức năng </h1>
        <section id="gallery">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 mb-4">
                        <div class="card" className='card-item'>
                            <div style={{ marginRight: 10 }}>
                                <FontAwesomeIcon icon={faGraduationCap} style={{ width: 60, height: 60 }} />
                            </div>
                            <div>
                                <h5 style={{ fontWeight: 'bold' }}>Đăng ký học</h5>
                                <p>Đăng ký các lớp học theo lộ trình hoặc các chứng chỉ kĩ năng cần thiết</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-4">
                        <div class="card" className='card-item'>
                            <div style={{ marginRight: 10 }}>
                                <FontAwesomeIcon icon={faFile} style={{ width: 60, height: 60 }} />
                            </div>
                            <div>
                                <h5 style={{ fontWeight: 'bold' }}>Chứng chỉ</h5>
                                <p>các chứng chỉ được cấp</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-4">
                        <div class="card" className='card-item'>
                            <div style={{ marginRight: 10 }}>
                                <FontAwesomeIcon icon={faBriefcase} style={{ width: 60, height: 60 }} />
                            </div>
                            <div>
                                <h5 style={{ fontWeight: 'bold' }}>Cơ hội việc làm</h5>
                                <p>Tìm kiếm các cơ hội việc làm từ các doanh nghiệp và thông tin tuyển dụng</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-4">
                        <div class="card" className='card-item'>
                            <div style={{ marginRight: 10 }}>
                                <FontAwesomeIcon icon={faNewspaper} style={{ width: 60, height: 60 }} />
                            </div>
                            <div>
                                <h5 style={{ fontWeight: 'bold' }}>Bài viết</h5>
                                <p>Các bài báo, tạp chí nghiên cứu khoa học</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-4">
                        <div class="card" className='card-item'>
                            <div style={{ marginRight: 10 }}>
                                <FontAwesomeIcon icon={faUser} style={{ width: 60, height: 60 }} />
                            </div>
                            <div>
                                <h5 style={{ fontWeight: 'bold' }}>Quản lý học tập</h5>
                                <p>Quản lý các lớp học và các khóa học chứng chỉ</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mb-4">
                        <div class="card" className='card-item'>
                            <div style={{ marginRight: 10 }}>
                                <FontAwesomeIcon icon={faCheck} style={{ width: 60, height: 60 }} />
                            </div>
                            <div>
                                <h5 style={{ fontWeight: 'bold' }}>Khảo sát</h5>
                                <p>Ý kiến, góp ý đánh giá của giảng viên và sinh viên</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    );
}

export default Utilities;