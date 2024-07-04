import React, { useState, useEffect, useRef } from 'react'
// import './Dashboard.css';
import TopBar from "./TopBar/TopBar";
import * as echarts from 'echarts';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

require("highcharts/modules/timeline.js")(Highcharts);

function Dashboard() {
    const { user } = useSelector(state => state.user)
    const { tenant } = useSelector(state => state.tenant)

    const navigate = useNavigate();

    const [data, setData] = useState({});
    const chartRef = useRef(null);
    const chartRef2 = useRef(null);
    const socketRef = useRef(null);
    const [chartData, setChartData] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const fetchData = async () => {
        const res = await fetch(`/events?user=${user}`);
        const d = {};
        const newData = await res.json();
        newData.forEach(function (item) {
            const [key, value] = item;

            if (!d[key]) {
                d[key] = []; // Initialize an empty array if the key doesn't exist in the map
            }
            d[key].push(value);
        });
        console.log(d, "das")
        setData(d);
        setDataFetched(true)
    };
    useEffect(() => {
        console.log("uu", user)
        if (user == "") {
            //   console.log("usee", localStorage.getItem('user'))
            navigate("/")
        }
    }, [])

    useEffect(() => {
        socketRef.current = io('/');

        // socketRef.current.on('connect', () => {
        //     alert("ff");
        // });

        socketRef.current.on('new_event', (event) => {
            const [key, value] = event;
            const d = { ...data };
            if (!d[key]) {
                d[key] = [];
            }
            d[key].push(value);
            setData(d);
            setChartData(prevChartData => [...prevChartData, { name: key, label: value, x: prevChartData.length }]);

        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [data, chartData]);

    useEffect(() => {



        fetchData();
        if (dataFetched) {
            const myChart = echarts.init(chartRef.current);
            // const barchart = echarts.init(chartRef2.current);

            var option = {
                tooltip: {
                    trigger: 'item'
                },
                color: ["#35008B", "#5D33A2", "#8566B9", "#9A7FC5", "#C2B2DC", "#EAE5F3", "black"],
                // color: ['#9BBCFF','#7AA1FF','#5787FF','#2A6EF5','#0050b8','#00357a','#001f47','#000'],
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '50%'],
                        center: ['50%', '50%'],
                        // adjust the start and end angle
                        startAngle: 90,
                        endAngle: 180,
                        data: [
                            { value: data?.pageScroll?.length, name: 'Page Scroll' },
                            { value: data?.pageLoad?.length, name: 'Window Load' },
                            { value: data?.elementClick?.length, name: 'Element Click' },
                            { value: data?.DOMready?.length, name: 'DOM Ready' },
                            { value: data?.Timer?.length, name: 'Timer' },
                            { value: data?.elementVisible?.length, name: 'Element Visible' },

                        ]
                    }
                ]
            };
            myChart.setOption(option);

            var option2 = {
                tooltip: {},
                dataset: {
                    source: [
                        ['Matcha Latte', 43.3, 85.8, 93.7],
                        ['Milk Tea', 83.1, 73.4, 55.1],
                        ['Cheese Cocoa', 86.4, 65.2, 82.5],
                        ['Walnut Brownie', 72.4, 53.9, 39.1]
                    ]
                },
                xAxis: { type: 'category' },
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
            };


            // barchart.setOption(option2);


        }


        // const interval = setInterval(fetchData, 1000);
        return () => {
            // clearInterval(interval)
        };
    }, [chartData, dataFetched]);

    const chartOptions = {

        chart: {
            type: 'timeline'
        },
        colors: ["#35008B", "#5D33A2", "#8566B9", "#9A7FC5", "#C2B2DC", "#EAE5F3", "black"],

        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{typeDescription}</div>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            },
            point: {
                valueDescriptionFormat: '{index}. {point.label}. {point.description}.'
            }
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        title: {
            text: 'Timeline of Events'
        },
        subtitle: {
            text: 'Info source: <a href="https://en.wikipedia.org/wiki/Timeline_of_space_exploration">www.wikipedia.org</a>'
        },
        // colors: [
        //   '#4185F3',
        //   '#427CDD',
        //   '#406AB2',
        //   '#3E5A8E',
        //   '#3B4A68',
        //   '#363C46'
        // ],
        series: [{
            data: chartData.length > 5 ? [...chartData.slice(Math.max(chartData.length - 5, 0))] : [...chartData]
        }]
    };
    console.log("chartdata", chartData)

    return (

        <>
            <div className="top-bar">
                {/* <span>Analytics</span> */}
            </div>
            <TopBar />
            {/* <div className="container top-row">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div >
                                <i className="fas fa-hand-pointer"></i>
                                <span id="elementClick" className='event-heading'> Elements Click</span>
                            </div>


                            {data.elementClick && <span>{data.elementClick.length}</span>}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div >
                                <i className="fas fa-redo-alt"></i>
                                <span id="pageLoad" className='event-heading'>Window Load</span>
                            </div>
                            {data.pageLoad && <span>{data.pageLoad.length}</span>}

                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                        <div>
                                <i className="fas fa-hand-pointer"></i>
                                <span id="pageScroll" className='event-heading'> Page Scroll</span>

                            </div>
                            {data.pageScroll && <span>{data.pageScroll.length}</span>}
                        </div>

                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                <div className="col-md-4">
                        <div className="card">
                            <div ref={chartRef} style={{ height: '400px', width: '400px' }}>

                            </div>
                        </div>

                    </div>
                </div></div>
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div>
                                <i className="fas fa-hourglass-half"></i>
                                <span id="timer" className='event-heading' >Timer</span>
                            </div>
                            {data.timer && <span>{data.timer.length}</span>}

                        </div>
                    </div>

                </div>



            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div>
                                <i class="fas fa-eye"></i>
                                <span id="elementVisible" className='event-heading'>Element Visible</span>

                            </div>
                            {data.elementVisible && <span>{data.elementVisible.length}</span>}

                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div>
                                <i class="fab fa-wpforms"></i>
                                <span id="formSubmit" className='event-heading'>Form Submit</span>
                            </div>
                            {data.formSubmit && <span>{data.formSubmit.length}</span>}

                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div>
                                <i className="fas fa-users"></i>
                                <span className='event-heading'>DOMready</span>

                            </div>
                            {data.domReady && <span>{data.domReady.length}</span>}
                        </div>
                    </div>


                </div>



            </div> */}

            <div className=" container" style={{ minWidth: "700px" }}>
                <div className='row top-row'>
                    <div className='col-md-5 '>
                        <div className='row' style={{ marginTop: '30px' }}>
                            <div className='col-sm '>
                                <h1>Overview</h1>
                            </div>
                        </div>
                        <div className='row  ' >
                            <div className='col-6 '>
                                <div className="card">
                                    <div>
                                        <i className="fas fa-hourglass-half"></i>
                                        <span id="timer" className='event-heading' > Timer</span>
                                    </div>
                                    {data.Timer && <span>{data.Timer.length}</span>}

                                </div>
                            </div>
                            <div className='col-sm '>
                                <div className="card">
                                    <div>
                                        <i class="fas fa-eye"></i>
                                        <span id="elementVisible" className='event-heading'> Element Visible</span>

                                    </div>
                                    {data.elementVisible && <span>{data.elementVisible.length}</span>}

                                </div>
                            </div>

                        </div>
                        <div className='row '>
                            <div className='col-sm '>
                                <div className="card">
                                    <div>
                                        <i class="fab fa-wpforms"></i>
                                        <span id="formSubmit" className='event-heading'> Form Submit</span>
                                    </div>
                                    {data.formSubmit && <span>{data.formSubmit.length}</span>}

                                </div>
                            </div>
                            <div className='col-sm '>
                                <div className="card">
                                    <div>
                                        <i className="fas fa-users"></i>
                                        <span className='event-heading'> DOM ready</span>

                                    </div>
                                    {data.DOMready && <span>{data.DOMready.length}</span>}
                                </div>
                            </div>

                        </div>
                        <div className='row '>
                            <div className='col' style={{ marginTop: "10px" }}>

                                {/* <div ref={chartRef2} style={{ height: '300px' }}>

                                </div> */}
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={chartOptions}
                                />
                            </div>

                        </div>
                    </div>
                    <div className='col-md-7 '>
                        <div className='row '>
                            <div className='col-sm '>
                                <div className="card">
                                    <div >
                                        <i className="fas fa-hand-pointer"></i>
                                        <span id="elementClick" className='event-heading'> Element Click</span>
                                    </div>


                                    {data.elementClick && <span>{data.elementClick.length}</span>}
                                </div>
                            </div>
                            <div className='col-sm '>
                                <div className="card">
                                    <div >
                                        <i className="fas fa-redo-alt"></i>
                                        <span id="pageLoad" className='event-heading'> Window Load</span>
                                    </div>
                                    {data.pageLoad && <span>{data.pageLoad.length}</span>}

                                </div>
                            </div>
                            <div className='col-sm '>
                                <div className="card">
                                    <div>
                                        <i class="fas fa-angle-double-down"></i>
                                        <span id="pageScroll" className='event-heading'> Page Scroll</span>

                                    </div>
                                    {data.pageScroll && <span>{data.pageScroll.length}</span>}
                                </div>

                            </div>
                            <div className='col-sm '>
                                <div className="card">
                                    <div>
                                        <i class="fas fa-angle-double-down"></i>
                                        <span id="linkClick" className='event-heading'> Link Click</span>

                                    </div>
                                    {data.linkClick && <span>{data.linkClick.length}</span>}
                                </div>

                            </div>
                        </div>
                        <div className='row '>
                            <div className='col-sm '>
                                <div className="card" style={{ padding: 0 }}>
                                    <div ref={chartRef} style={{ height: '500px' }}>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='row '>
                    <div className='col-sm '>
                        <div className="card">
                            <div >
                                <i class="fas fa-download"></i>
                                <span id="downloadClick" className='event-heading'> Download Click</span>
                            </div>


                            {data.downloadClick && <span>{data.downloadClick.length}</span>}
                        </div>
                    </div>
                    <div className='col-sm '>
                        <div className="card">
                            <div >
                                <i class="fas fa-expand"></i>
                                <span id="fullScreen" className='event-heading'> Full Screen</span>
                            </div>
                            {data.fullScreen && <span>{data.fullScreen.length}</span>}

                        </div>
                    </div>
                    <div className='col-sm '>
                        <div className="card">
                            <div >
                                <i class="fas fa-expand"></i>
                                <span id="historyChange" className='event-heading'> History Change</span>
                            </div>
                            {data.historyChange && <span>{data.historyChange.length}</span>}

                        </div>
                    </div>
                    <div className='col-sm '>
                        <div className="card">
                            <div >
                                <i class="fas fa-expand"></i>
                                <span id="windowLeave" className='event-heading'> Window Leave </span>
                            </div>
                            {data.windowLeave && <span>{data.windowLeave.length}</span>}

                        </div>
                    </div>
                    <div className='col-sm '>
                        <div className="card">
                            <div >
                                <i class="fas fa-expand"></i>
                                <span id="pageUnload" className='event-heading'> Page Unload</span>
                            </div>
                            {data.pageUnload && <span>{data.pageUnload.length}</span>}

                        </div>
                    </div>
                    

                </div>
            </div>

            <div className='container'>

            </div>
            <button className="print-button" onclick="window.print()"><i className="fas fa-print"></i> Print</button>

        </>
    )
}

export default Dashboard