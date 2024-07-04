import React, { useEffect, useState } from 'react'
import "./Trigger.css"
import {  useSelector } from 'react-redux';
function Trigger() {
    const {user} =useSelector(state=>state.user)
    const {tenant:tenant_name} =useSelector(state=>state.tenant)
    console.log("current user",tenant_name,user);
    const [showCreateTrigger, setCreateTrigger] = useState(false);
    const [triggers, setTriggers] = useState();
    const triggerType = {
        "Page Load": 'pageLoad',
        "Element Click": 'elementClick',
        "DOM Ready": 'domReady',
        "Timer": 'timer',
        'Page Scroll': 'pageScroll',
        "Element Visibility": 'elementVisible',
        "Form Submission": "formSubmit",
        "Link Click":"linkClick",
        "Download Link Click":"downloadClick",
        "Full Screen":"fullScreen",
        "History Change":"historyChange",
        "Window Leave":"windowLeave",
        "Page Unload":'pageUnload'
    }
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedTenant, setSelectedTenant] = useState('adapterdemo');
    const handleSelectChange = (event) => {

        setSelectedValue(event.target.value);
        console.log(selectedValue, "sel")
    };
    const handleTenantChange = (value) => {
        setSelectedTenant(value);
    };
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://127.0.0.1:5000/triggers?tenant=${tenant_name}`);

            const newData = await res.json();
            console.log("das", newData)
            setTriggers(newData.triggers);
            // newData.forEach(function (item) {
            //         const [key, value] = item;

            //         if (!d[key]) {
            //             d[key] = []; // Initialize an empty array if the key doesn't exist in the map
            //         }
            //         d[key].push(value);
            //     });
            //     // console.log(newData)
            // setData(d);
        };
        fetchData();
    }, [selectedTenant])
    return (
        <>
            <div class="dropdown">
               <h4>{tenant_name}</h4>
            </div>
            <span className='heading' id="dashb">Trigger</span>
            <button className='btn btn-primary' onClick={() => { setCreateTrigger(!showCreateTrigger) }}>+ </button>
            <div className='row'>
                <div className={showCreateTrigger ? 'col-md-7 transition' : 'col-md-12 transition'}>
                <div className="">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {triggers && triggers.map((trigger, index) => (
                            <tr key={index}>
                                <td>{trigger.id}</td>
                                <td>{trigger.name}</td>
                                <td>{trigger.type}</td>
                                <td>{trigger.created_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

                </div>
                <div className={showCreateTrigger ? 'col-md-5 myElement visible' : 'myElement'}>
                {showCreateTrigger && <main>
                <section>
                    <form action="/triggers" id="signin-form" method='post'>
                        <fieldset>
                            {/* <legend>Sign Into Your Account</legend> */}

                            <label for="triggerName">Trigger Name:</label>
                            <input type="text" id="triggerName" name="triggerName" required />
                            <br />
                            <label for="triggerType">Trigger Type:</label>
                            <select id="triggerType" name="triggerType" required onChange={handleSelectChange} >
                                {Object.entries(triggerType).map(([key, value]) => (
                                    <option value={value}>{key}</option>

                                ))}

                            </select>
                            <input type="hidden" name="tenant" value={tenant_name} />
                            <br />
                            <br />
                            {selectedValue === 'timer' && (
                                <>
                                    <label for="interval">Interval</label>
                                    <input type="number" min={0} id="interval" name="interval" required/>

                                </>
                            )}
                            {selectedValue === 'pageScroll' && (
                                <>
                                    <label for="threshold">Threshold</label>
                                    <input type="number" min={0} max={100} id="threshold" name="threshold" required/>

                                </>
                            )}
                            {selectedValue === 'elementVisible' && (
                                <>
                                    <label for="css_selector">CSS Selector</label>
                                    <p className='details'>Examples for valid selectors are ".classname", "#id" or "li a".</p>
                                    <input type="text" id="css_selector" name="css_selector"required />

                                </>
                            )}
                            <label for="triggerWhen">Trigger When</label>
                            <select id="element" name="element" aria-placeholder='Property ID' className='trigger-condition'>
                                <option value="pageURL">PageURL</option>
                                <option value="element_id">Click Id</option>
                                <option value="element_class">Click Class</option>
                                <option value="element_text">Click Text</option>


                            </select>
                            <select id="condition" name="condition" aria-placeholder='Property ID' className='trigger-condition'>
                                <option value="equals">Equals</option>
                            </select>
                            <input type="text" id="value" name="value" className='trigger-condition' />

                            <button type="submit">Submit</button>
                        </fieldset>

                    </form>

                    {/* <p class="center lead">Don't have an account? <a href="#" className="Tags">Sign up</a>.</p> */}
                </section>
            </main>}
                </div>
            </div>
           
          

        </>

    )
}

export default Trigger