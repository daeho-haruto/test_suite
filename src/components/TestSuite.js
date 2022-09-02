import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";
import ros from '../config/ros-config';
import '../components/TestSuite.css'

const TestSuite = () => {
    const [topicArr, setTopicArr] = useState([])
    const [bummperData, setBummperData] = useState(false);
    const [emergencyData, setEmergencyData] = useState(false);
    const [safetyLanternData, setSafetyLanternData] = useState(false);
    const [batteryData, setBatteryData] = useState(0.0);

    const BOOLTYPE = 'std_msgs/Bool'


    const [bummper,] = useState(new ROSLIB.Topic({
        ros : ros,
        name : '/uros/bumper',
        messageType : BOOLTYPE
    }));

    const [emergency,] = useState(new ROSLIB.Topic({
        ros : ros,
        name : '/emergency',
        messageType : BOOLTYPE
    }));

    const [safety_lantern,] = useState(new ROSLIB.Topic({
        ros : ros,
        name : '/uros/safety_lantern',
        messageType : BOOLTYPE
    }));

    const [battery,] = useState(new ROSLIB.Topic({
        ros : ros,
        name : '/battery/voltage',
        messageType : 'std_msgs/Float32'
    }));

    // const [imu,] = useState(new ROSLIB.Topic({
    //     ros : ros,
    //     name : '/imu/data',
    //     messageType : 'sensor_msgs/msg/Imu'
    // }));

    // const [scan,] = useState(new ROSLIB.Topic({
    //     ros : ros,
    //     name : '/scan',
    //     messageType : 'sensor_msgs/LaserScan'
    // }));

    const rosSendPauseTopic = new ROSLIB.Topic({
        ros : ros,
        name : '/pause',
        messageType : BOOLTYPE
    });


    useEffect(() => {
        bummper.subscribe((m) => {
            setBummperData(m.data);
        });
    });

    useEffect(() => {
        emergency.subscribe((m) => {
            setEmergencyData(m.data);
        });
    });

    useEffect(() => {
        safety_lantern.subscribe((m) => {
            console.log(m.data)
            setSafetyLanternData(m.data);
        });
    });

    useEffect(() => {
        battery.subscribe((m) => {
            setBatteryData(m.data)
        });
    });

    useEffect(() => {
        getTopics()
    })

    function getTopics() {
        var topicsClient = new ROSLIB.Service({
            ros : ros,
            name : '/rosapi/topics',
            serviceType : 'rosapi/Topics'
        });
    
        var request = new ROSLIB.ServiceRequest();
    
        topicsClient.callService(request, function(result) {
            // console.log(result.topics);
            setTopicArr(result.topics)
        });
    }


    const sendTopic = (data) => {
        const pauseTopicMsg = new ROSLIB.Message({
            data 
        });
    
        console.log('sendTopic', rosSendPauseTopic, pauseTopicMsg);
        rosSendPauseTopic.publish(pauseTopicMsg);
    }

    return(
        <div>
            <div className="container">
                <div className="bummper" style={bummperData ? {background: 'green'} : {background: 'red'}}>bummper</div>
                <div className="emergency" style={emergencyData ? {background: 'green'} : {background: 'red'}}>emergency</div>
                <div className="safety_lantern" style={safetyLanternData ? {background: 'green'} : {background: 'red'}}>safety_lantern</div>
                <div className="battery" style={batteryData > 0 ? {background: 'green'} : {background: 'red'}}>battery</div>
                <div className="imu" style={topicArr.includes('/imu/data') ? {background: 'green'} : {background: 'red'}}>imu</div>
                <div className="scan" style={topicArr.includes('/imu/data') ? {background: 'green'} : {background: 'red'}}>scan</div>
            </div>
            <div>
                <button onClick={() =>sendTopic(true)}>True</button>
                <button onClick={() =>sendTopic(false)}>False</button>
            </div>
        </div>
    )
}

export default TestSuite