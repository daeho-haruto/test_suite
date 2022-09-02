import ROSLIB from "roslib"

const ip = '192.168.250.13'

const ros = new ROSLIB.Ros({
    url : 'ws://'+ ip +':9090'
});

ros.on('error', (error) => {
    console.error('ROS error!!');
});

ros.on('connection', () => {
    console.log('ROS connection success!!');
});

ros.on('close', () => {
    console.log('ROS conncetion closed');
});

ros.connect(process.env.REACT_APP_ROS_WS_PORT);

export default ros;
