//Test comment after crash

const redis = require('redis');

//Constants of channels 
const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool }) {
        //Every pubsub instance will have a LOCAL BLOCKCHAIN INSTANCE
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        //Create publishers and subscribers
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        //Make generic function to subscribe to channels in general
        this.subscribeToChannels();

        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
    }

    //METHOD to REPLACE CHAIN based on incoming blockchain messages from the blockchain channel 
        //Replaces chain if longer VALID one is received on the blockchain channel
    handleMessage(channel, message) {
        console.log(`DEFAULT RESPONSE: Message received. Channel: ${channel}. Message: ${message}`);

        const parsedMessage = JSON.parse(message);

        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage);
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            
        }

        //Want strict typecheck, so use ===
        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        //Callback AUTOMATICALLY takes care of subscription for ALL channels
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    //METHOD to SEND MESSAGE over DESIGNATED CHANNEL
    publish({ channel, message }) {
        //Three-step encapsulation ensures that:
            //1. You unsubscribe from the channel
            //2. Publish the message
            //3. Resubscribe to the channel
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    //METHOD to broadcast blockchain
    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,

            //Can only publish STRINGS in pubsub channels, so wrap in JSON.stringify
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    //METHOD: broadcast transaction over the Blockchain
    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }
}

//Commented lower lines in favor of exporting to be used by another class 
module.exports = PubSub;

//const testPubSub = new PubSub();
////Set delay of 1000 milliseconds to ensure reliability of firing
//setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);