import React, { useState, useEffect } from 'react'
// import "../Dashboard.css";
import "./TopBar.css";
import {  useSelector ,useDispatch} from 'react-redux';
import { resetState } from '../../redux';
function TopBar() {
    const {user} =useSelector(state=>state.user)
    const dispatch = useDispatch();
    useEffect(()=>{},[user])
    // alert(window.location.href)
    return (
        <>
            <div class="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'white', boxShadow: '6px 4px 20px #c3c5c6' }}>
                <h2>Analytics</h2>
                {/* <div></div> */}

                <ul className='navbar-nav mr-auto'>
                    <a className='btn' href="/dashboard">Dashboard</a>
                    <a className='btn' href="/tag">Tag Manager</a>
                   {user!="" ?  <a className='btn' href="/" onClick={()=>dispatch(resetState())}>Logout</a>: <a className='btn' href="/">Login</a>}
                </ul>

                {/* {isSubmenuOpen && (
                        <ul className="top-down-animation navbar-nav mr-auto">
                            <li onClick={()=>{onSelect('Tag')}}>Tags</li>
                            <li onClick={()=>onSelect('Trigger')}>Triggers</li>
                        </ul>

                    )} */}
            </div>
        </>


    )
}

export default TopBar