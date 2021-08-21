import React, { useState, useEffect } from 'react';
import { Bar, defaults } from 'react-chartjs-2';
import axios from 'axios';

defaults.backgroundColor = '#4cd4d4';

const BarChart = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        axios.get('./model/assignment-sample-data.json')
        .then(resp => {
            let dataMap = {},
            assignee = [],
            noOfTickets = [];

            resp.data.records.forEach((el, i) => {
                if(dataMap.hasOwnProperty(el.assignee)) {
                    dataMap[el.assignee].tickets += 1;

                    let statusName = el.status;

                    if(statusName in dataMap[el.assignee].status) {
                        dataMap[el.assignee].status[statusName] += 1;
                    } else {
                        dataMap[el.assignee].status[statusName] = 1;
                    }
                } else {
                    let statusName = el.status;
                    let currAssignee = {
                        [el.assignee]: {
                            tickets: 1,
                            status: {[statusName]: 1},
                        }
                    };
                    dataMap = {...dataMap, ...currAssignee};
                }
            });


            for (const [key] of Object.entries(dataMap)) {
                assignee.push(key);
                noOfTickets.push(dataMap[key].tickets);
            }

            setData({
                labels: assignee,
                datasets: [{
                    label: 'Tickets',
                    data: noOfTickets,
                }]
            });
    
            console.log(data);
        })
        .catch(error => console.error(error));
    }, []);

    return (
        <Bar
            data={data}
            className={'Bar-chart'}
            height={500}
            width={800}
            options={{
                responsive: false,
                maintainAspectRatio: false
            }}
        />
    )
}

export default BarChart;
