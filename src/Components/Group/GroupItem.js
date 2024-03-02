import React from "react";
function GroupItem(props) {
    const name=props.name;
    const photoURL=props.photoURL;
    console.log(photoURL);
    return (
        <div class="relative group bg-gray-500 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
            <img class="w-20 h-20 object-cover object-center rounded-full" src={photoURL} alt="cuisine" />
            <h4 class="text-white text-2xl font-bold capitalize text-center">{name}</h4>
            <p class="text-white/50">55 members</p>
            <p class="absolute top-2 text-white/20 inline-flex items-center text-xs">22 Online <span class="ml-2 w-2 h-2 block bg-green-500 rounded-full group-hover:animate-pulse"></span></p>
        </div>
    );
}

export default GroupItem;