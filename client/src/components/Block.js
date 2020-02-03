import React, { Component } from 'react';

class Block extends Component {
    render() {
        const {timestamp, hash, data} = this.props.block;
    
        const hashDisplay = `${hash.substring(0,15)}...`;
        const stringifiedData = JSON.stringify(data);

        const dataDisplay = `${stringifiedData.substring(0,15)}...`;
    }
};

export default Block;