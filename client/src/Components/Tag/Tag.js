import React, { useEffect, useState, useRef } from 'react'
import ReactEchart from "echarts-for-react";
import * as echarts from 'echarts';
import Select from 'react-select'

// import { useSelector } from 'react-redux';
import {  useSelector } from 'react-redux';


import "./Tags.css";
function Tag() {
    const {user:username} =useSelector(state=>state.user)
    const [showCreateTag, setCreateTag] = useState(false);
    const {tenant:tenant_name} =useSelector(state=>state.tenant)

    const [tags, setTags] = useState();
    const [triggers, setTriggers] = useState();
    const chartRef = useRef(null);
    const [selectedTenant, setSelectedTenant] = useState('adapterdemo');
    const [options, setOption] = useState();
    // const user = useSelector(state => state.user);
    const [selectedTriggers, setSelectedTriggers] = useState([]);



    const handleTriggerChange = (selectedOptions) => {
        console.log("selected option")
        const triggerIDs = selectedOptions.map((option) => option.value);
        setSelectedTriggers(triggerIDs);
    };

    const tenant = [
        'adapterdemo', 'cduidev', "ritik", 'qa3uitesting0412'

    ]
    const handleTenantChange = (value) => {
        setSelectedTenant(value);
    };

    // useEffect(()=>{console.log("loggedin user",user)},[user])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://127.0.0.1:5000/tags/?tenant=${tenant_name}`);
            const newData = await res.json();
            console.log("das", newData)
            setTags(newData.tags);
            setTriggers(newData.triggers);
            const t = newData.triggers.map((trigger) => {
                return { value: trigger.id, label: trigger.name };
            });
            setOption(t);
            console.log("das", tags, triggers)
            // const myChart = echarts.init(chartRef.current);
            const option = {
                title: {
                    // text: '特性示例：渐变色 阴影 点击缩放',
                    // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
                },
                xAxis: {
                    data: dataAxis,
                    axisLabel: {
                        inside: true,
                        color: '#fff'
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#999'
                    }
                },
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        showBackground: true,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#83bff6' },
                                { offset: 0.5, color: '#188df0' },
                                { offset: 1, color: '#188df0' }
                            ])
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#2378f7' },
                                    { offset: 0.7, color: '#2378f7' },
                                    { offset: 1, color: '#83bff6' }
                                ])
                            }
                        },
                        data: data
                    }
                ]
            };
            // myChart.setOption(option);
            const zoomSize = 6;
            // myChart.on('click', function (params) {
            //     console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
            //     myChart.dispatchAction({
            //         type: 'dataZoom',
            //         startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
            //         endValue:
            //             dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
            //     });
            // });


        };
        fetchData();
    }, [selectedTenant])
    // prettier-ignore
    let dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
    // prettier-ignore
    let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
    let yMax = 500;
    let dataShadow = [];

    for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }





    return (
        <>
            <div class="dropdown">
                {/* <button class="btn  dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" >
                    {selectedTenant}
                </button>
                <div class="dropdown-menu">
                    {tenant.map((element) => {
                        return <button class="dropdown-item" type="button" value={element} onClick={() => { handleTenantChange(element) }}>{element}</button>

                    })}

                </div> */}
                <h4>{tenant_name}</h4>
            </div>
            <span className='heading' id="dashb">Tags</span>

            <button className='btn btn-primary' onClick={() => { setCreateTag(!showCreateTag) }}>+ </button>
            <div className='row'>
                <div className={showCreateTag ? 'col-md-7 transition' : 'col-md-12 transition'}>

                    <table style={{ background: 'white' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Created At</th>
                                <th>Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tags && tags.map((tag, index) => (
                                <tr key={index}>
                                    <td>{tag.name}</td>
                                    <td>{tag.type}</td>
                                    <td>{tag.created_at}</td>
                                    {/* <td><input type="checkbox" role="switch" class="grow" onChange={} /></td> */}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={showCreateTag ? 'col-md-5 myElement visible' : 'myElement'}>
                    {showCreateTag && <main style={{ background: 'white' }}>
                        <section>
                            <form action="/tags/" id="signin-form" method='post'>
                                <fieldset>
                                    {/* <legend>Sign Into Your Account</legend> */}

                                    <label for="tagName">Tag Name:</label>
                                    <input type="text" id="tagName" name="tagName" required />
                                    <br />
                                    <label for="tagType">Tag Type:</label>
                                    <input type="text" id="tagType" name="tagType" required />
                                    <br />

                                    <label for="triggerID">Trigger:</label>
                                    {/* <select id="triggerID" name="triggerID"  multiple required onChange={handleTriggerChange} >
                                        {triggers && triggers.map((trigger, index) => {
                                            return <option key={index} value={trigger.id}>{trigger.name}</option>

                                        })}

                                    </select> */}
                                    <input type="hidden" name="tenant" value={tenant_name} />
                                    <input type="hidden" name="user" value={username} />


                                    <Select 
                                    options={options} 
                                    isMulti 
                                    name="triggerID"
                                        // value={selectedTriggers}
                                        // onChange={handleTriggerChange}

                                    />
                                    <button type="submit">Submit</button>


                                    {/* <input type="checkbox" name="remember-me-input" id="remember-me-input" />
                            <label for="remember-me-input">Remember me</label> */}
                                </fieldset>

                            </form>

                            {/* <p class="center lead">Don't have an account? <a href="#" className="Tags">Sign up</a>.</p> */}
                        </section>
                    </main>}
                </div>

            </div>
            {/* <div ref={chartRef} style={{ height: '400px', width: '400px' }}>

            </div> */}
                {/* <ReactEchart option={option} /> */}



        </>

    )
}

export default Tag