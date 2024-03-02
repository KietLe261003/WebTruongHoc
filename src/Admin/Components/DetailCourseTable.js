import React from "react";

function DetailCourseTable(props) {
    const course = props.course;
    return ( 
        <table class="table-auto w-full">
                        <thead>
                           <tr class="bg-primary text-center">
                              <th class="w-1/7 min-w-[160px] text-lg font-semibold  text-white py-4 lg:py-7 px-3lg:px-4 border-l border-transparent">
                                 Id
                              </th>
                              <th class="w-1/7 min-w-[160px] text-lg font-semibold  text-white py-4 lg:py-7 px-3lg:px-4 border-l border-transparent">
                                 Tiêu đề
                              </th>
                              <th class="w-1/7 min-w-[160px] text-lg font-semibold  text-white py-4 lg:py-7 px-3lg:px-4 border-l border-transparent">
                                 Thời gian học
                              </th>
                              <th class="w-1/7 min-w-[160px] text-lg font-semibold  text-white py-4 lg:py-7 px-3lg:px-4 border-l border-transparent">
                                 Loại khóa học
                              </th>
                              <th class="w-1/7 min-w-[160px] text-lg font-semibold  text-white py-4 lg:py-7 px-3lg:px-4 border-l border-transparent">
                                 Thời Gian bắt đầu
                              </th>
                              <th class="w-1/7 min-w-[160px] text-lg font-semibold  text-white py-4 lg:py-7 px-3lg:px-4 border-l border-transparent">
                                 Số người đăng ký
                              </th>
                              <th class="w-1/7 min-w-[160px] text-lg font-semibold  text-white py-4 lg:py-7 px-3lg:px-4 border-l border-transparent">
                                 Trạng thái
                              </th>
                           </tr>
                        </thead>
                         <tbody>
                            {
                               course &&
                               <tr>
                                  <td class=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                     {course.id}
                                  </td>
                                  <td class=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                     {course.nameCourse}
                                  </td>
                                  <td class=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                     {course.time}
                                  </td>
                                  <td class=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                     {course.type === "1" ? "Trả phí" : "Miễn Phí"}
                                  </td>
                                  <td class=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                     {course.dateStart}
                                  </td>
                                  <td class=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                     {course.menberJoin}
                                  </td>
                                  <td class=" text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">
                                        <select 
                                          class="inline px-4 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800"
                                          defaultValue={course.accepted === true ? "True" : "False"}>
                                           <option value={"True"}>True</option>
                                           <option value={"False"}>False</option>
                                        </select>
                                  </td>
                               </tr>
                            }
                         </tbody>
                     </table>
     );
}

export default DetailCourseTable;