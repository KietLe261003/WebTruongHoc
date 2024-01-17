import React from "react";
import CardCourse from './CardCourse';
function ListCard() {
    const LCard = Array.from({ length: 14 });
    return (
        <div>
            <h1 style={{textAlign: "center"}}>Xin chào tất cả các bạn</h1>
            <div class=" flex min-h-screen flex-col justify-center overflow-hidden bg-gray">
                <div class="mx-auto max-w-screen-xl px-4 w-full">
                    <h2 class="mb-4 font-bold text-xl text-gray-600">Tất cả các khóa học sẽ được hiển thị ở đây</h2>
                    <div class="grid w-full sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {
                            LCard.map((index) => (
                                <CardCourse></CardCourse>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListCard;