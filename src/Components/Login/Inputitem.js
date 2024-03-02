import React from "react";

function InputItem(props) {
    const type=props.type;
    const label=props.label;
    return (
        <div class="form-outline form-white mb-4">
            <input type={type} id="typePasswordX" class="form-control form-control-lg" />
            <label class="form-label" for="typePasswordX">{label}</label>
        </div>
    );
}

export default InputItem;