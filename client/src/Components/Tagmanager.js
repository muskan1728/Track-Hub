import React, { useState, useEffect } from 'react'
import "./Tagmanager.css"
import Sidebar from "./TopBar/TopBar";
import Tag from "./Tag/Tag";
import Trigger from "./Trigger/Trigger";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function TagManager() {

    const { user } = useSelector(state => state.user)
    const navigate = useNavigate();
    const [comp, setComp] = useState(null);
    const url = window.location.href;
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(url.includes("tag") ? true : false);
    function handleMenu(option) {
        console.log(option)
        switch (option) {
            case "Tag":
                setComp(<Tag />);
                break;
            case "Trigger":
                setComp(<Trigger />);
        }

    }
    useEffect(() => {
        console.log("uu", user)
        if (user == "") {
            //   console.log("usee", localStorage.getItem('user'))
            navigate("/")
        }
    }, [])

    return (

        <>
            <div className="top-bar">
                {/* <h2>Analytics</h2> */}
            </div>
            {/* <Sidebar onSelect={handleMenu}/> */}
            <Sidebar />
            <div className='sidebar' >

                {isSubmenuOpen && (
                    <ul className="">
                        <li onClick={() => { handleMenu('Tag') }}>
                            <div className='row'>
                                <div className='col-md-3'><i class="fas fa-tag"></i></div>
                                <div className='col-md-6'>Tags</div>
                            </div>
                        </li>
                        <li onClick={() => handleMenu('Trigger')}>
                            <div className='row'>
                                <div className='col-md-3'><i class="fas fa-bell"></i></div>
                                <div className='col-md-6'>Triggers</div>
                            </div>
                        </li>
                    </ul>

                )}

            </div>

            <div className="box">
                {comp}

            </div>

        </>
    )
}

export default TagManager