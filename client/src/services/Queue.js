import React, {Component} from 'react';
import ReactTable from "react-table";

class Queue extends Component{
    constructor(props){
        super(props);
        this.state = {queue: [], length: 0};
    }
    async componentDidMount(){
        var newQueue = await this.getQueue();
        console.log(newQueue);
        this.setState({
            queue: newQueue,
            length: newQueue.length
        });
    }
    getQueue(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'React POST Request Example' })
        };
        return fetch('/api', requestOptions).then(response => response.json());
    }
    render(){
        if (this.state.queue){
            return (
                <ol>
                    {this.state.queue.map(data => (
                        <li key={data.name}>
                            <p>{data.name}</p>
                            <p>{data.recording_url}</p>
                            <p>{data.priority}</p>
                        </li>
                    ))}
                </ol>
                )
        }
        else{
            return (<div>Hi!</div>);
        }
    }

}

export default Queue;