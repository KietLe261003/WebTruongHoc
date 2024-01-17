import React from "react";
import GroupItem from "./GroupItem";
function ListGroup() {
    const LGroup= Array.from({length: 7});
    return (<div class="bg-gray flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row sm:p-6 sm:my-2  sm:rounded-2xl w-full">
        <div class="flex-1 px-2 sm:px-0">
            <div class="flex justify-between items-center">
                <h3 class="text-3xl font-extralight text-black/50">Groups</h3>
                <div class="inline-flex items-center space-x-2">
                    <a class="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </a>
                    <a class="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </a>
                </div>
            </div>
            <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div class="group bg-gray-900/30 py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/40 hover:smooth-hover">
                    <a class="bg-gray-900/70 text-white/50 group-hover:text-white group-hover:smooth-hover flex w-20 h-20 rounded-full items-center justify-center" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </a>
                    <a class="text-white/50 group-hover:text-white group-hover:smooth-hover text-center" href="/">Create group</a>
                </div>
                {
                    LGroup.map((index) => (
                        <a href="/Class">
                            <GroupItem></GroupItem>
                        </a>
                    ))
                }
            </div>
        </div>
    </div>);
}

export default ListGroup;