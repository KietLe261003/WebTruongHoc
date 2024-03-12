import React from "react";
import CardBlog from "./CardBlog";
import { useNavigate } from "react-router-dom";

function ListCardBlog() {
   const navigate= useNavigate();
    const opModal = () => {
        navigate("/Blog/CreateBlog");
    }
    return (
        <div>
            <button onClick={opModal} class="rounded-xl float-right border-2 border-blue-500 px-3 py-3 text-base mb-3 font-medium text-blue-500 transition duration-200 hover:bg-red-600/5 active:bg-red-700/5">
                Thêm bài viết
            </button>
            <CardBlog></CardBlog>
            <CardBlog></CardBlog>
            <CardBlog></CardBlog>
            
        </div>
    );
}

export default ListCardBlog;
